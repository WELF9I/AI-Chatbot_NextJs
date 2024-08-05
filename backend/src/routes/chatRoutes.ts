import express from 'express';
import { 
  sendMessage, 
  createChat, 
  deleteChat, 
  getChatHistory, 
  getAllChats 
} from '../controllers/chatController';
import pool from '../config/database';

const router = express.Router();

router.post('/send', sendMessage);
router.post('/create', createChat);
router.delete('/:id', deleteChat);
router.get('/history/:id', getChatHistory);
router.get('/all', getAllChats);

router.get('/test-db', async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.json({ message: 'Database connection successful', time: result.rows[0].now });
    } catch (error) {
      console.error('Database connection error:', error);
      //@ts-ignore
      res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
  });
export default router;