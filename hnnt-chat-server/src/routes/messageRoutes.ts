import { Router } from 'express';
import { GetMessageOfChat, SendMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const messageRouter = Router();
messageRouter.get('/:chatId', authenticate, GetMessageOfChat);
messageRouter.post('/:chatId', authenticate, SendMessage);

export default messageRouter;
