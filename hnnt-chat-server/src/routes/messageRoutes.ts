import { Router } from 'express';
import {
    getMessageOfChat,
    sendMessage,
    deleteMessage,
    destroyMessage,
    reactionMessage,
    removeReactionOfMessage,
    pinOfMessage,
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const messageRouter = Router();
messageRouter.get('/:chatId', authenticate, getMessageOfChat);
messageRouter.post('/:chatId', authenticate, sendMessage);
messageRouter.put('/:messageId', authenticate, deleteMessage);
messageRouter.put('/:messageId/destroy', authenticate, destroyMessage);
messageRouter.put('/:messageId/reaction', authenticate, reactionMessage);
messageRouter.delete('/:messageId/reaction', authenticate, removeReactionOfMessage);
messageRouter.put('/:messageId/pin', authenticate, pinOfMessage);

export default messageRouter;
