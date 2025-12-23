// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  window.location.reload();
};

export const uploadFiles = async (files) => {
  const formData = new FormData();
  // Handle FileList or Array or Single File
  if (files instanceof FileList || Array.isArray(files)) {
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
  } else {
    formData.append('files', files);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    }
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload files');
  }
};

export const clearContext = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/context`, {
      headers: getAuthHeader()
    });
  } catch (error) {
    console.error('Error clearing context:', error);
  }
};

export const processPDF = uploadFiles; // Alias for backward compatibility if needed

export const queryLLM = async ({ message, chatHistory = [], context = null }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      message,
      chatHistory,
      context,
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    }
    console.error('Error querying LLM:', error);
    throw new Error(error.response?.data?.message || 'Failed to get response from AI');
  }
};