import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', authenticate, logout);

export default authRouter;
