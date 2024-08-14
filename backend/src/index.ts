import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://ai-chatbot-seven-fawn.vercel.app'
}));
app.use(express.json());

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('AI Chatbot API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});