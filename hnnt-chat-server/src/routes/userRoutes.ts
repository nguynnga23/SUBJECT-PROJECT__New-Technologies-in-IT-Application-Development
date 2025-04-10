import { Router } from 'express';
import { updateUser, updateAvatar, changePasswordByToken } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const userRoute = Router();
const upload = multer(); // Initialize multer for handling multipart/form-data

userRoute.put('/update-user', authenticate, updateUser);
userRoute.post('/update-avatar', authenticate, upload.single('image'), updateAvatar); // Add multer middleware
userRoute.post('/change-password-with-token', authenticate, changePasswordByToken);

export default userRoute;
