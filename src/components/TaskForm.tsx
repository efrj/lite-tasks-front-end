import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, Textarea, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Task {
  id: number;
  name: string;
  description: string;
  delivery_date: string;
}

interface TaskFormProps {
  onClose: () => void;
  task?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, task }) => {
  const [name, setName] = useState(task ? task.name : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(task ? new Date(task.delivery_date) : new Date());
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formattedDeliveryDate = deliveryDate ? format(new Date(deliveryDate), 'yyyy-MM-dd HH:mm:ss') : '';
  
    try {
      if (task) {
        await axios.put(`http://localhost:8000/api/tasks/${task.id}`, {
          name,
          description,
          delivery_date: formattedDeliveryDate,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: 'Tarefa atualizada.',
          description: 'A tarefa foi atualizada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await axios.post('http://localhost:8000/api/tasks', {
          name,
          description,
          delivery_date: formattedDeliveryDate,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: 'Tarefa criada.',
          description: 'A tarefa foi criada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
  
      onClose();
    } catch (error) {
      toast({
        title: 'Ocorreu um erro.',
        description: 'Não foi possível salvar a tarefa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };  

  return (
    <VStack spacing={4} padding={4} align="start">
      <FormControl id="name">
        <FormLabel>Nome da Tarefa</FormLabel>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl id="description">
        <FormLabel>Descrição</FormLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>
      <FormControl id="deliveryDate">
        <FormLabel>Data de Entrega</FormLabel>
        <DatePicker
          selected={deliveryDate}
          onChange={(date: Date | null) => setDeliveryDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
        />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit} mr={4}>
        {task ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
      </Button>
      <Button colorScheme="gray" onClick={onClose}>
        Fechar
      </Button>
    </VStack>
  );
};

export default TaskForm;
