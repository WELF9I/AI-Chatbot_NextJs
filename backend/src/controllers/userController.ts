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

      let user = await client.query('SELECT * FROM users WHERE clerk_id = $1', [clerk_id]);

      if (user.rows.length === 0) {
        user = await client.query(
          'INSERT INTO users (clerk_id, name, email) VALUES ($1, $2, $3) RETURNING *',
          [clerk_id, name, email]
        );
      } else {
        user = await client.query(
          'UPDATE users SET name = $2, email = $3 WHERE clerk_id = $1 RETURNING *',
          [clerk_id, name, email]
        );
      }

      await client.query('COMMIT');
      res.json(user.rows[0]);
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