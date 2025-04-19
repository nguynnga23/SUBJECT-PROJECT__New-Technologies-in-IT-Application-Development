import express from 'express';
import { blockUser, unblockUser, getBlockedUsers } from '../controllers/blockController';

const router = express.Router();

router.post('/block', blockUser); // Chặn người dùng
router.post('/unblock', unblockUser); // Bỏ chặn người dùng
router.get('/blocked/:blockerAccountId', getBlockedUsers); // Lấy danh sách người dùng bị chặn

export default router;
