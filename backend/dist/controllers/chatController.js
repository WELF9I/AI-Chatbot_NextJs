"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatTitle = exports.updateChatTitle = exports.getAllChats = exports.getChatHistory = exports.deleteChat = exports.createChat = exports.sendMessage = void 0;
const geminiService_1 = require("../services/geminiService");
const database_1 = __importDefault(require("../config/database"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversation_id, content, role } = req.body;
        if (!content || !conversation_id || !role) {
            return res.status(400).json({ error: 'conversation_id, content, and role are required' });
        }
        if (role !== 'user') {
            return res.status(400).json({ error: 'Only user messages can be sent through this endpoint' });
        }
        const response = yield (0, geminiService_1.generateResponse)(content);
        const client = yield database_1.default.connect();
        try {
            yield client.query('BEGIN');
            const userMessageResult = yield client.query('INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3) RETURNING *', [conversation_id, content, 'user']);
            const assistantMessageResult = yield client.query('INSERT INTO messages (conversation_id, content, role) VALUES ($1, $2, $3) RETURNING *', [conversation_id, response, 'assistant']);
            yield client.query('COMMIT');
            res.json({
                userMessage: Object.assign(Object.assign({}, userMessageResult.rows[0]), { isNew: true }),
                assistantMessage: Object.assign(Object.assign({}, assistantMessageResult.rows[0]), { isNew: true })
            });
        }
        catch (transactionError) {
            yield client.query('ROLLBACK');
            console.error('Transaction error in sendMessage:', transactionError);
            res.status(500).json({ error: 'An error occurred while processing your message' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ error: 'An error occurred while processing your message' });
    }
});
exports.sendMessage = sendMessage;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, user_id } = req.body;
        if (!title || !user_id) {
            return res.status(400).json({ error: 'Title and user_id are required' });
        }
        const result = yield database_1.default.query('INSERT INTO conversations (title, user_id) VALUES ($1, $2) RETURNING *', [title, user_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error in createChat:', error);
        res.status(500).json({ error: 'An error occurred while creating the chat' });
    }
});
exports.createChat = createChat;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }
        const result = yield database_1.default.query('DELETE FROM conversations WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error in deleteChat:', error);
        res.status(500).json({ error: 'An error occurred while deleting the chat' });
    }
});
exports.deleteChat = deleteChat;
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }
        const result = yield database_1.default.query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC', [id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error in getChatHistory:', error);
        res.status(500).json({ error: 'An error occurred while fetching chat history' });
    }
});
exports.getChatHistory = getChatHistory;
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const result = yield database_1.default.query('SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error in getAllChats:', error);
        res.status(500).json({ error: 'An error occurred while fetching all chats' });
    }
});
exports.getAllChats = getAllChats;
const updateChatTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (!id || !title) {
            return res.status(400).json({ error: 'Chat ID and title are required' });
        }
        const result = yield database_1.default.query('UPDATE conversations SET title = $1 WHERE id = $2 RETURNING *', [title, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error in updateChatTitle:', error);
        res.status(500).json({ error: 'An error occurred while updating the chat title' });
    }
});
exports.updateChatTitle = updateChatTitle;
const generateChatTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }
        const result = yield database_1.default.query('SELECT content FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC LIMIT 1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No messages found for this chat' });
        }
        const latestMessage = result.rows[0].content;
        const generatedTitle = `${latestMessage.substring(0, 20)}...`;
        yield database_1.default.query('UPDATE conversations SET title = $1 WHERE id = $2', [generatedTitle, id]);
        res.json({ title: generatedTitle });
    }
    catch (error) {
        console.error('Error in generateChatTitle:', error);
        res.status(500).json({ error: 'An error occurred while generating the chat title' });
    }
});
exports.generateChatTitle = generateChatTitle;
