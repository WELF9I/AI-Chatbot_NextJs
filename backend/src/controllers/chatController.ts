import { Request, Response } from 'express';
import { generateResponse } from '../services/geminiService';
import pool from '../config/database';
import { Conversation, Message } from '../types';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversation_id, content, role } = req.body;
    
    if (!content || !conversation_id || !role) {
      return res.status(400).json({ error: 'conversation_id, content, and role are required' });
    }

    if (role !== 'user') {
      return res.status(400).json({ error: 'Only user messages can be sent through this endpoint' });
    }

    // Generate response from AI
    const response = await generateResponse(content);

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user message
      const userMessageResult = await client.query<Message>(
        'INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3) RETURNING *',
        [conversation_id, content, 'user']
      );

      // Insert assistant message
      const assistantMessageResult = await client.query<Message>(
        'INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3) RETURNING *',
        [conversation_id, response, 'assistant']
      );

      await client.query('COMMIT');

      res.json({ 
        userMessage: userMessageResult.rows[0],
        assistantMessage: assistantMessageResult.rows[0]
      });
    } catch (transactionError) {
      await client.query('ROLLBACK');
      console.error('Transaction error in sendMessage:', transactionError);
      res.status(500).json({ error: 'An error occurred while processing your message' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'An error occurred while processing your message' });
  }
};
export const createChat = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query<Conversation>(
      'INSERT INTO conversations (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error in createChat:', error);
    res.status(500).json({ error: 'An error occurred while creating the chat' });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    // No need to delete messages separately due to ON DELETE CASCADE
    const result = await pool.query('DELETE FROM conversations WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteChat:', error);
    res.status(500).json({ error: 'An error occurred while deleting the chat' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    const result = await pool.query<Message>(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'An error occurred while fetching chat history' });
  }
};

export const getAllChats = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Conversation>('SELECT * FROM conversations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getAllChats:', error);
    res.status(500).json({ error: 'An error occurred while fetching all chats' });
  }
};