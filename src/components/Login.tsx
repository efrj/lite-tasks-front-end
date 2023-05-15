import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { logIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: formData.email,
        password: formData.password,
      });
      
      if (response.data.token) {
        toast({
          title: "Logged in.",
          description: "You have successfully logged in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem('token', response.data.token);
        logIn();
        navigate('/');
      } else {
        toast({
          title: "An error occurred.",
          description: response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "An error occurred.",
        description: error?.response?.data?.message || error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} padding={4}>
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>Login</Button>
    </VStack>
  );
};
