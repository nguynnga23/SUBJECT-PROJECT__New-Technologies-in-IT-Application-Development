import { Router } from 'express';
import multer from 'multer';
import {
    getMessageOfChat,
    sendMessage,
    deleteMessage,
    destroyMessage,
    reactionMessage,
    removeReactionOfMessage,
    pinOfMessage,
    deletePinOfMessage,
    searchForKeyWord,
    searchForKeyWordByChat,
    uploadFileToS3,
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';
const messageRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

messageRouter.post('/upload', authenticate, upload.single('file'), uploadFileToS3);
messageRouter.get('/search/', authenticate, searchForKeyWord);
messageRouter.get('/search/:chatId/', authenticate, searchForKeyWordByChat);
messageRouter.get('/:chatId', authenticate, getMessageOfChat);
messageRouter.post('/:chatId', authenticate, sendMessage);
messageRouter.put('/:messageId', authenticate, deleteMessage);
messageRouter.put('/:messageId/destroy', authenticate, destroyMessage);
messageRouter.put('/:messageId/reaction', authenticate, reactionMessage);
messageRouter.delete('/:messageId/reaction', authenticate, removeReactionOfMessage);
messageRouter.put('/:messageId/pin', authenticate, pinOfMessage);
messageRouter.put('/:messageId/pin/delete', authenticate, deletePinOfMessage);

export default messageRouter;
