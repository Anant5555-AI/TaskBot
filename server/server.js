import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Tesseract from 'tesseract.js';

// LangChain imports
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { VectorStore } from "@langchain/core/vectorstores";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for images

// -------------------- AUTHENTICATION --------------------

const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };
    saveUser(newUser);

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
});

// -------------------- STORAGE CONFIG --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  },
});

// Custom Memory Vector Store to avoid import issues
class MyMemoryVectorStore extends VectorStore {
  constructor(embeddings) {
    super(embeddings, {});
    this.memoryVectors = [];
  }

  _vectorstoreType() {
    return "memory";
  }

  async addDocuments(documents) {
    const texts = documents.map(({ pageContent }) => pageContent);
    const embeddings = await this.embeddings.embedDocuments(texts);

    for (let i = 0; i < documents.length; i++) {
      this.memoryVectors.push({
        content: documents[i].pageContent,
        embedding: embeddings[i],
        metadata: documents[i].metadata,
      });
    }
  }

  async similaritySearchVectorWithScore(query, k, filter) {
    const searches = this.memoryVectors.map((vec, index) => ({
      similarity: this.cosineSimilarity(query, vec.embedding),
      index,
    }));

    searches.sort((a, b) => b.similarity - a.similarity);

    const result = searches.slice(0, k).map(search => {
      const vec = this.memoryVectors[search.index];
      return [
        new Document({
          pageContent: vec.content,
          metadata: vec.metadata,
        }),
        search.similarity,
      ];
    });

    return result;
  }

  cosineSimilarity(a, b) {
    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }
}

// Initialize Components
const embeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY,
  topK: 3,
  model: "embed-english-v3.0",
});

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7
});

// In-Memory User Vector Stores (Username -> VectorStore)
const userVectorStores = {};

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.delete('/api/context', authenticateToken, (req, res) => {
  const username = req.user.username;
  if (userVectorStores[username]) {
    delete userVectorStores[username];
  }
  res.json({ success: true, message: 'Context cleared' });
});

app.post('/api/upload', authenticateToken, upload.array('files', 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const username = req.user.username;
  let totalDocs = 0;
  let newChunks = 0;

  try {
    console.log(`Processing ${req.files.length} file(s) for user: ${username}`);

    let allChunks = [];

    for (const file of req.files) {
      let docs = [];
      if (file.mimetype === 'application/pdf') {
        const loader = new PDFLoader(file.path);
        docs = await loader.load();
      } else if (file.mimetype.startsWith('image/')) {
        // Process Image
        console.log(`Doing OCR on image: ${file.path}`);
        const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
        docs = [new Document({ pageContent: text, metadata: { source: file.originalname, type: 'image' } })];
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
      });
      const chunks = await splitter.splitDocuments(docs);
      allChunks.push(...chunks);
      totalDocs += docs.length;
      newChunks += chunks.length;

      // Clean up file
      fs.unlinkSync(file.path);
    }

    // Add to User's Vector Store (Append mode)
    let vectorStore = userVectorStores[username];
    if (!vectorStore) {
      vectorStore = new MyMemoryVectorStore(embeddings);
      userVectorStores[username] = vectorStore;
    }

    if (allChunks.length > 0) {
      await vectorStore.addDocuments(allChunks);
    }

    console.log(`Added ${newChunks} chunks to vector store for user: ${username}`);

    res.json({
      success: true,
      message: `${req.files.length} file(s) processed successfully`,
      totalDocs,
      newChunks,
      currentTotalVectors: vectorStore.memoryVectors.length
    });

  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process files',
      error: error.message,
    });
  }
});

app.post('/api/chat', authenticateToken, async (req, res) => {
  const { message, chatHistory = [] } = req.body;
  const username = req.user.username;

  try {
    let responseText;

    const formattedHistory = chatHistory.map(msg => [
      msg.sender === 'user' ? 'human' : 'ai',
      msg.content
    ]);

    const userStore = userVectorStores[username];

    if (userStore) {
      // RAG Flow
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant. Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\nContext:\n{context}"],
        ...formattedHistory,
        ["human", "{question}"],
      ]);

      const retriever = userStore.asRetriever(3);

      const formatDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n\n");

      const ragChain = RunnableSequence.from([
        {
          context: (input) => retriever.invoke(input.question).then(formatDocs),
          question: (input) => input.question,
        },
        prompt,
        llm,
        new StringOutputParser(),
      ]);

      responseText = await ragChain.invoke({
        question: message,
      });

    } else {
      // Simple Chat Flow
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant. You do not have access to any PDF context right now."],
        ...formattedHistory,
        ["human", "{question}"],
      ]);

      const chain = prompt.pipe(llm).pipe(new StringOutputParser());

      responseText = await chain.invoke({
        question: message,
      });
    }

    res.json({
      success: true,
      answer: responseText,
    });

  } catch (error) {
    console.error('Error in chat completion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get response from AI',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🤖 Using LangChain with Cohere and Groq');
});
