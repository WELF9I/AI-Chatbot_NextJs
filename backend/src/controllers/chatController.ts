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
    const response = await generateResponse(content);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const userMessageResult = await client.query<Message>(
        'INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3) RETURNING *',
        [conversation_id, content, 'user']
      );
      const assistantMessageResult = await client.query<Message>(
        'INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3) RETURNING *',
        [conversation_id, response, 'assistant']
      );
  
      await client.query('COMMIT');
  
      res.json({ 
        userMessage: { ...userMessageResult.rows[0], isNew: true },
        assistantMessage: { ...assistantMessageResult.rows[0], isNew: true }
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
    const { title, clerk_id } = req.body;
    if (!title || !clerk_id) {
      return res.status(400).json({ error: 'Title and clerk_id are required' });
    }
    const userResult = await pool.query('SELECT id FROM users WHERE clerk_id = $1', [clerk_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    const result = await pool.query<Conversation>(
      'INSERT INTO conversations (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, userId]
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
    const { clerk_id } = req.query;

    if (!clerk_id) {
      return res.status(400).json({ error: 'Clerk ID is required' });
    }

    const result = await pool.query<Conversation>(
      'SELECT * FROM conversations WHERE user_id = (SELECT id FROM users WHERE clerk_id = $1) ORDER BY created_at DESC',  // Map clerk_id to user_id
      [clerk_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getAllChats:', error);
    res.status(500).json({ error: 'An error occurred while fetching all chats' });
  }
};



export const updateChatTitle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!id || !title) {
      return res.status(400).json({ error: 'Chat ID and title are required' });
    }

    const result = await pool.query(
      'UPDATE conversations SET title = $1 WHERE id = $2 RETURNING *',
      [title, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in updateChatTitle:', error);
    res.status(500).json({ error: 'An error occurred while updating the chat title' });
  }
};
export const generateChatTitle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    const result = await pool.query<Message>(
      'SELECT content FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No messages found for this chat' });
    }

    const latestMessage = result.rows[0].content;
    const generatedTitle = `${latestMessage.substring(0, 20)}...`;

    await pool.query(
      'UPDATE conversations SET title = $1 WHERE id = $2',
      [generatedTitle, id]
    );

    res.json({ title: generatedTitle });
  } catch (error) {
    console.error('Error in generateChatTitle:', error);
    res.status(500).json({ error: 'An error occurred while generating the chat title' });
  }
};