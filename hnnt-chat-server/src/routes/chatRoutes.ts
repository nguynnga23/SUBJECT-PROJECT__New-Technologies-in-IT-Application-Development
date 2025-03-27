import { Router } from 'express';
import { GetChatOfUser, GetChatById } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

// Middleware `authenticate` bây giờ đúng kiểu dữ liệu
chatRouter.get('/', authenticate, GetChatOfUser);
chatRouter.get('/:chatId', authenticate, GetChatById);

export default chatRouter;
