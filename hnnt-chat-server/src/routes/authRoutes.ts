import { Router } from 'express';
import { register, login, logout, refreshToken, forgotPassword } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.delete('/logout', logout);

authRouter.put('/refresh_token', refreshToken);

authRouter.post('/forgot-password', forgotPassword);

export default authRouter;
