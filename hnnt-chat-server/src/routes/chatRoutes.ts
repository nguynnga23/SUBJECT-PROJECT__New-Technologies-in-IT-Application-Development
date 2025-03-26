import { Router } from 'express';
import { GetChatOfUser } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

// Middleware `authenticate` bây giờ đúng kiểu dữ liệu
chatRouter.get('/', authenticate, GetChatOfUser);

export default chatRouter;
