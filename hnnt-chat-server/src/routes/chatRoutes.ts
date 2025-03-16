import { Router } from 'express';
import { getChatOfUser } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

// Middleware `authenticate` bây giờ đúng kiểu dữ liệu
chatRouter.get('/', authenticate, getChatOfUser);

export default chatRouter;
