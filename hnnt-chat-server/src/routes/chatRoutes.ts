import { Router } from 'express';
import {
    GetChatOfUser,
    PinChatOfUser,
    NotifyChatOfUser,
    AddCategoryToChat,
    GetChatById,
    GetChatByUser,
    ReadedChatOfUser,
    ReadedAllChatOfUser,
    PriorityChatOfUser,
} from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

// Middleware `authenticate` bây giờ đúng kiểu dữ liệu
chatRouter.get('/', authenticate, GetChatOfUser);
chatRouter.get('/:chatId', authenticate, GetChatById);
chatRouter.get('/user/:userId2', authenticate, GetChatByUser);
chatRouter.put('/:chatId/pin', authenticate, PinChatOfUser);
chatRouter.put('/:chatId/notify', authenticate, NotifyChatOfUser);
chatRouter.put('/:chatId/priority', authenticate, PriorityChatOfUser);
chatRouter.put('/:chatId/category', authenticate, AddCategoryToChat);
chatRouter.put('/:chatId/readed', authenticate, ReadedChatOfUser);
chatRouter.put('/all-readed', authenticate, ReadedAllChatOfUser);

export default chatRouter;
