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
exports.createOrGetUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const createOrGetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerk_id, name, email } = req.body;
    if (!clerk_id || !name || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const client = yield database_1.default.connect();
        try {
            yield client.query('BEGIN');
            let user = yield client.query('SELECT * FROM users WHERE clerk_id = $1', [clerk_id]);
            if (user.rows.length === 0) {
                user = yield client.query('INSERT INTO users (clerk_id, name, email) VALUES ($1, $2, $3) RETURNING *', [clerk_id, name, email]);
            }
            else {
                user = yield client.query('UPDATE users SET name = $2, email = $3 WHERE clerk_id = $1 RETURNING *', [clerk_id, name, email]);
            }
            yield client.query('COMMIT');
            res.json(user.rows[0]);
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('Error in createOrGetUser:', error);
        res.status(500).json({ error: 'An error occurred while processing the user' });
    }
});
exports.createOrGetUser = createOrGetUser;
