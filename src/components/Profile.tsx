import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

const Profile: React.FC = () => {
  const { loggedIn } = useAuth();
  const [user, setUser] = useState<any>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
          } else if (error.request) {
            console.log('Request:', error.request);
          } else {
            console.log('Error:', error.message);
          }
        }
      }
    };

    if (loggedIn && token) {
      fetchUser();
    }
  }, [loggedIn, token]);

  if (!loggedIn) {
    return null;
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Dados do Usuário</Heading>
      <Text>Nome: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
    </Box>
  );
};

export default Profile;
