import { Router } from 'express';
import { GetChatOfUser, PinChatOfUser, NotifyChatOfUser } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

// Middleware `authenticate` bây giờ đúng kiểu dữ liệu
chatRouter.get('/', authenticate, GetChatOfUser);
chatRouter.put('/:chatId/pin', authenticate, PinChatOfUser);
chatRouter.put('/:chatId/notify', authenticate, NotifyChatOfUser);

export default chatRouter;
