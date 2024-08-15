import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ai-chatbot-1nwo.onrender.com',
});
export const generateTitle = async (conversationId: number) => {
    const response = await api.post(`/api/chat/generate-title/${conversationId}`);
    return response.data.title;
  };
  
  export const updateChatTitle = async (chatId: number, newTitle: string) => {
    const response = await api.put(`/api/chat/update-title/${chatId}`, { title: newTitle });
    return response.data;
  };
  
  export const deleteChat = async (chatId: number) => {
    const response = await api.delete(`/api/chat/${chatId}`);
    return response.data;
  };
  export const getAllChats = async (clerkUserId: string) => {
    const response = await api.get('/api/chat/all', { params: { clerk_id: clerkUserId } });
    return response.data;
  };
  
  export const createChat = async (title: string, clerkUserId: string) => {
    const response = await api.post('/api/chat/create', { title, clerk_id: clerkUserId });
    return response.data;
  };
  
  export const getChatHistory = async (chatId: number, clerkUserId: string) => {
    const response = await api.get(`/api/chat/history/${chatId}`, { params: { clerk_id: clerkUserId } });
    return response.data;
  };
  
  export const sendMessage = async (conversationId: number, content: string, clerkUserId: string) => {
    const response = await api.post('/api/chat/send', { conversation_id: conversationId, content, role: 'user', clerk_id: clerkUserId });
    return response.data;
  };
  
  export const createOrGetUser = async (clerkId: string, name: string, email: string) => {
    console.log('Sending createOrGetUser request:', { clerk_id: clerkId, name, email });
    const response = await api.post('/api/chat/user', { clerk_id: clerkId, name, email });
    return response.data;
  };