import { Router } from 'express';
import { login, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', authenticate, logout);

export default authRouter;
