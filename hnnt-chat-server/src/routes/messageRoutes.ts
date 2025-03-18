import { Router } from 'express';
import { GetMessageOfChat, SendMessage, deleteMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const messageRouter = Router();
messageRouter.get('/:chatId', authenticate, GetMessageOfChat);
messageRouter.post('/:chatId', authenticate, SendMessage);
messageRouter.put('/:messageId', authenticate, deleteMessage);

export default messageRouter;
