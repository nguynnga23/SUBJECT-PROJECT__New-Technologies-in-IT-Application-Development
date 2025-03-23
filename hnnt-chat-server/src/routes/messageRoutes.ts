import { Router } from 'express';
import {
    GetMessageOfChat,
    SendMessage,
    deleteMessage,
    destroyMessage,
    reactionMessage,
    removeReactionOfMessage,
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const messageRouter = Router();
messageRouter.get('/:chatId', authenticate, GetMessageOfChat);
messageRouter.post('/:chatId', authenticate, SendMessage);
messageRouter.put('/:messageId', authenticate, deleteMessage);
messageRouter.put('/:messageId/destroy', authenticate, destroyMessage);
messageRouter.put('/:messageId/reaction', authenticate, reactionMessage);
messageRouter.delete('/:messageId/reaction', authenticate, removeReactionOfMessage);

export default messageRouter;
