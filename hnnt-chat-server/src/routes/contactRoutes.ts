import { Router } from 'express';
import { getListGroupChatByUserId, getChatByFriendId } from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/list-group-chats', authenticate, getListGroupChatByUserId); //get list group chat by userId
router.get('/chat/:friendId', authenticate, getChatByFriendId); // Get chat by friend ID

export default router;
