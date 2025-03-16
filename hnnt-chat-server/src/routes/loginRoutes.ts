import { Router } from 'express';
import { login } from '../controllers/loginController';

const friendRouter = Router();

friendRouter.post('/login', login);

export default friendRouter;
