import { Router } from 'express';
import { updateUser, updateAvatar } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.put('/update-user', authenticate, updateUser);
authRouter.put('/update-avatar', authenticate, updateAvatar);

export default authRouter;
