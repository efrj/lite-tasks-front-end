import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Box, Heading, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, useToast } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TaskForm from './TaskForm';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface Task {
  id: number;
  name: string;
  description: string;
  delivery_date: string;
}

const TaskList: React.FC = () => {
  const { loggedIn } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem('token');
  const sortedTasks = tasks.sort((a, b) => b.id - a.id);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const { isOpen: editModalIsOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();
  const { isOpen: deleteModalIsOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
  const toast = useToast();

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    openEditModal();
  };

  const handleDeleteTask = async (taskId: number) => {
    setDeleteTaskId(taskId);
    openDeleteModal();
  };

  const handleConfirmDeleteTask = async () => {
    if (deleteTaskId) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/tasks/${deleteTaskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        await fetchTasks();
  
        toast({
          title: 'Tarefa excluída.',
          description: 'A tarefa foi excluída com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description: 'Não foi possível excluir a tarefa.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setDeleteTaskId(null);
        closeDeleteModal();
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
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

    return Promise.resolve();
  };

  useEffect(() => {
    if (loggedIn) {
      fetchTasks();
    }
  }, [loggedIn]);

  const handleOpenModal = () => {
    setSelectedTask(undefined);
    openEditModal();
  };

  const handleCloseModal = () => {
    closeEditModal();
    fetchTasks();
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <Box>
      <Button colorScheme="teal" onClick={handleOpenModal}>Criar Nova Tarefa</Button>
      <br />
      <br />
      <Heading as="h2" size="lg" mb={4}>Lista de Tarefas</Heading>
      {tasks.map((task) => (
        <Box key={task.id} p={4} borderWidth={1} borderRadius="md" mb={4}>
          <Text fontWeight="bold">{task.name}</Text>
          <Text>{task.description}</Text>
          <Text>Delivery Date: {format(new Date(task.delivery_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</Text>
          <Button colorScheme="blue" onClick={() => handleEditTask(task)}>
            <FiEdit />
          </Button>
          <Button colorScheme="red" onClick={() => handleDeleteTask(task.id)}>
            <FiTrash2 />
          </Button>
        </Box>
      ))}
      
      <Modal isOpen={editModalIsOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTask !== undefined ? 'Editar Tarefa' : 'Criar Tarefa'}</ModalHeader>
          <ModalBody>
            <TaskForm onClose={handleCloseModal} task={selectedTask} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModalIsOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar exclusão</ModalHeader>
          <ModalBody>Deseja realmente excluir esta tarefa?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleConfirmDeleteTask}>
              Excluir
            </Button>
            <Button colorScheme="gray" onClick={closeDeleteModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskList;

