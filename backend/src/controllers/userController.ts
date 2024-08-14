import { Request, Response } from 'express';
import pool from '../config/database';

export const createOrGetUser = async (req: Request, res: Response) => {
  const { clerk_id, name, email } = req.body;

  if (!clerk_id || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if user exists
      const existingUser = await client.query('SELECT * FROM users WHERE clerk_id = $1', [clerk_id]);

      let user;
      if (existingUser.rows.length === 0) {
        // Create new user
        const result = await client.query(
          'INSERT INTO users (clerk_id, name, email) VALUES ($1, $2, $3) RETURNING *',
          [clerk_id, name, email]
        );
        user = result.rows[0];
      } else {
        user = existingUser.rows[0];
      }

      await client.query('COMMIT');
      res.json(user);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in createOrGetUser:', error);
    res.status(500).json({ error: 'An error occurred while processing the user' });
  }
};