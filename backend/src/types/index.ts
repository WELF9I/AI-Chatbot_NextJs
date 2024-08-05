export interface Conversation {
  id: number;
  title: string;
  created_at: Date;
}

export interface Message {
  id: number;
  conversation_id: number;
  content: string;
  role: 'user' | 'assistant';
  created_at: Date;
}