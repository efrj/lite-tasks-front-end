import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { logIn } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirmation: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirmation) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation
      });
      
      if (response.data.user) {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem('token', response.data.token);
        logIn();
        navigate('/login');
      } else {
        toast({
          title: "An error occurred.",
          description: response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to create account.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  return (
    <VStack spacing={4} padding={4}>
      <FormControl id="name">
        <FormLabel>Name</FormLabel>
        <Input type="text" name="name" value={formData.name} onChange={handleChange} />
      </FormControl>
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} />
      </FormControl>
      <FormControl id="passwordConfirmation">
        <FormLabel>Confirm Password</FormLabel>
        <Input type="password" name="passwordConfirmation" value={formData.passwordConfirmation} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>Register</Button>
    </VStack>
  );
};
