import { Router } from 'express';
import {
    login,
    logout,
    register,
    sendOTPEmail,
    verifyOTP,
    forgotPassword,
    changePassword,
    changePasswordByToken,
    createLoginToken,
    confirmLoginToken,
    checkLoginStatus,
    loginQR,
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
authRouter.post('/change-password-with-token', authenticate, changePasswordByToken);
authRouter.post('/qr-login/create', createLoginToken);
authRouter.post('/qr-login/confirm', confirmLoginToken);
authRouter.get('/qr-login/status', checkLoginStatus);
authRouter.post('/qr-login/login', loginQR);

export default authRouter;
