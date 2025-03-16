import { Router } from 'express';
import { GetMessageOfChat, SendMessage } from '../controllers/messageController';

const messageRouter = Router();
messageRouter.get('/:userId/:chatId', GetMessageOfChat);
messageRouter.post('/:chatId', SendMessage);

export default messageRouter;
