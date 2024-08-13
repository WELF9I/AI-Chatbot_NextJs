import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

export const sendMessage = async (conversationId: number, content: string) => {
  const response = await api.post('/chat/send', { conversation_id: conversationId, content, role: 'user' });
  return response.data;
};

export const createChat = async (title: string) => {
  const response = await api.post('/chat/create', { title });
  return response.data;
};

export const getChatHistory = async (chatId: number) => {
  const response = await api.get(`/chat/history/${chatId}`);
  return response.data;
};

export const getAllChats = async () => {
  const response = await api.get('/chat/all');
  return response.data;
};
export const generateTitle = async (conversationId: number) => {
    const response = await api.post(`/chat/generate-title/${conversationId}`);
    return response.data.title;
  };
  
  export const updateChatTitle = async (chatId: number, newTitle: string) => {
    const response = await api.put(`/chat/update-title/${chatId}`, { title: newTitle });
    return response.data;
  };
  
  export const deleteChat = async (chatId: number) => {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  };