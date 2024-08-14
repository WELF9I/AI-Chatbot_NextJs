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
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
router.post('/send', chatController_1.sendMessage);
router.post('/create', chatController_1.createChat);
router.delete('/:id', chatController_1.deleteChat);
router.get('/history/:id', chatController_1.getChatHistory);
router.get('/all', chatController_1.getAllChats);
router.put('/update-title/:id', chatController_1.updateChatTitle);
router.post('/generate-title/:id', chatController_1.generateChatTitle);
router.get('/test-db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT NOW()');
        res.json({ message: 'Database connection successful', time: result.rows[0].now });
    }
    catch (error) {
        console.error('Database connection error:', error);
        //@ts-ignore
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
}));
exports.default = router;
