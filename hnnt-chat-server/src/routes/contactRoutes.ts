import { Router } from 'express';
import { getListGroupChatByUserId } from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/list-group-chats', authenticate, getListGroupChatByUserId); //get list group chat by userId

export default router;
