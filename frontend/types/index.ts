export interface Chat {
    id: number;
    title: string;
  }
  
  export interface Message {
    id: number;
    content: string;
    role: 'user' | 'assistant';
  }