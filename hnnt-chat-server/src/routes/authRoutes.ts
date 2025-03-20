import { Router } from 'express';
import { login, logout, register, sendOTP, verifyOTP } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/register', register);
authRouter.post('/logout', authenticate, logout);

export default authRouter;
