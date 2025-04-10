import { Router } from 'express';
import { updateUser, updateAvatar, getUserById, getUserByNumberAndEmail } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.put('/update-user', authenticate, updateUser);
authRouter.post('/update-avatar', authenticate, updateAvatar);
authRouter.get('/:id', getUserById);
authRouter.post('/get-user-by-number-and-email', getUserByNumberAndEmail);

export default authRouter;
