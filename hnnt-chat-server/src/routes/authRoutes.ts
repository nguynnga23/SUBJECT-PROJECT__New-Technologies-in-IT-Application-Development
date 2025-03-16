import { Router } from 'express';
import { login } from '../controllers/loginController';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/login', login);

export default authRouter;
