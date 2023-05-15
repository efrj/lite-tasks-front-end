import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { AuthProvider } from './context/AuthContext';
import Menu from './components/Menu';
import Profile from './components/Profile';
import TaskList from './components/TaskList';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <AuthProvider>
      <ChakraProvider>
        <Router>
          <Menu />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
