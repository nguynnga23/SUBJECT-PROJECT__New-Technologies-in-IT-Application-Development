import { Router } from 'express';
import {
    login,
    logout,
    register,
    sendOTPEmail,
    verifyOTP,
    forgotPassword,
    changePassword,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/send-otp', sendOTPEmail);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/register', register);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/change-password', changePassword);
authRouter.post('/logout', authenticate, logout);

export default authRouter;
