import { Request, Response } from 'express';
import { generateResponse } from '../services/geminiService';
import pool from '../config/database';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;
    const response = await generateResponse(message);
    
    // Save message and response to database
    await pool.query(
      'INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3), ($1, $4, $5)',
      [conversationId, message, 'user', response, 'assistant']
    );

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your message' });
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO conversations (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the chat' });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM messages WHERE conversation_id = $1', [id]);
    await pool.query('DELETE FROM conversations WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the chat' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching chat history' });
  }
};

export const getAllChats = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM conversations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching all chats' });
  }
};