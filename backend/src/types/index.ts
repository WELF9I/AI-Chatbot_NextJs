export interface User {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: Date;
  user_id: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  content: string;
  role: 'user' | 'assistant';
  created_at: Date;
  user_id: number;
  isNew?: boolean;
}
