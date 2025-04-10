import { Router } from 'express';
import { updateUser, updateAvatar } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const authRouter = Router();
const upload = multer(); // Initialize multer for handling multipart/form-data

authRouter.put('/update-user', authenticate, updateUser);
authRouter.post('/update-avatar', authenticate, upload.single('image'), updateAvatar); // Add multer middleware

export default authRouter;
