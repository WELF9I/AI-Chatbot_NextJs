import express from 'express';
import { 
  sendMessage, 
  createChat, 
  deleteChat, 
  getChatHistory, 
  getAllChats, 
  updateChatTitle,
  generateChatTitle,
} from '../controllers/chatController';
import { createOrGetUser } from '../controllers/userController';
import pool from '../config/database';

const router = express.Router();
router.post('/user', createOrGetUser);
router.post('/send', sendMessage);
router.post('/create', createChat);
router.delete('/:id', deleteChat);
router.get('/history/:id', getChatHistory);
router.get('/all', getAllChats);
router.put('/update-title/:id', updateChatTitle);
router.post('/generate-title/:id', generateChatTitle);

router.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      res.json({ message: 'Database connection successful', time: result.rows[0].now });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    //@ts-ignore
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});
router.get('/check-tables', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const tables = ['users', 'conversations', 'messages'];
      const results = {};
      for (const table of tables) {
        const result = await client.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`, [table]);
        //@ts-ignore
        results[table] = result.rows[0].exists;
      }
      res.json({ tables: results });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error checking tables:', error);
    //@ts-ignore
    res.status(500).json({ error: 'Failed to check tables', details: error.message });
  }
});
export default router;
