import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const generateResponse = async (message: string): Promise<string> => {
  const result = await model.generateContent(message);
  return result.response.text();
};