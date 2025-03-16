import { Router } from 'express';
import { getChatOfUser } from '../controllers/chatController';

const chatRouter = Router();

chatRouter.get('/:userId', getChatOfUser);

export default chatRouter;
