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
      const result = await pool.query('SELECT NOW()');
      res.json({ message: 'Database connection successful', time: result.rows[0].now });
    } catch (error) {
      console.error('Database connection error:', error);
      //@ts-ignore
      res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

export default router;
