import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { login, register } from '../services/api';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    // Login State
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');

    // Register State
    const [regUser, setRegUser] = useState('');
    const [regPass, setRegPass] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(loginUser, loginPass);
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 3000,
            });
            onLoginSuccess();
            onClose();
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(regUser, regPass);
            toast({
                title: 'Registration Successful',
                description: 'You can now log in',
                status: 'success',
                duration: 3000,
            });
            // Optional: Auto-login after register or switch tab
        } catch (error) {
            toast({
                title: 'Registration Failed',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered closeOnOverlayClick={false} closeOnEsc={false}>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent>
                <ModalHeader textAlign="center">Welcome to PDF Chat</ModalHeader>
                <ModalBody pb={6}>
                    <Tabs isFitted variant="enclosed">
                        <TabList mb="1em">
                            <Tab>Login</Tab>
                            <Tab>Register</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <form onSubmit={handleLogin}>
                                    <VStack spacing={4}>
                                        <FormControl isRequired>
                                            <FormLabel>Username</FormLabel>
                                            <Input
                                                value={loginUser}
                                                onChange={(e) => setLoginUser(e.target.value)}
                                                placeholder="Enter your username"
                                            />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Password</FormLabel>
                                            <Input
                                                type="password"
                                                value={loginPass}
                                                onChange={(e) => setLoginPass(e.target.value)}
                                                placeholder="Enter your password"
                                            />
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            colorScheme="blue"
                                            width="full"
                                            isLoading={isLoading}
                                        >
                                            Login
                                        </Button>
                                    </VStack>
                                </form>
                            </TabPanel>
                            <TabPanel>
                                <form onSubmit={handleRegister}>
                                    <VStack spacing={4}>
                                        <FormControl isRequired>
                                            <FormLabel>Username</FormLabel>
                                            <Input
                                                value={regUser}
                                                onChange={(e) => setRegUser(e.target.value)}
                                                placeholder="Choose a username"
                                            />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Password</FormLabel>
                                            <Input
                                                type="password"
                                                value={regPass}
                                                onChange={(e) => setRegPass(e.target.value)}
                                                placeholder="Choose a password"
                                            />
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            colorScheme="green"
                                            width="full"
                                            isLoading={isLoading}
                                        >
                                            Register
                                        </Button>
                                    </VStack>
                                </form>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
