import { Router } from 'express';
import { register, login, logout, forgotPassword } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.delete('/logout', logout);

authRouter.post('/forgot-password', forgotPassword);

export default authRouter;
