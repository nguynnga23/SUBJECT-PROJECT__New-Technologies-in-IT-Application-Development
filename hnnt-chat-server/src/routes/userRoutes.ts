import { Router } from 'express';
import {
    updateUser,
    updateAvatar,
    getUserById,
    changePasswordByToken,
    getUserByNumberAndEmail,
    getUserByNumberOrEmail,
    searchUsers,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const userRoute = Router();
const upload = multer(); // Initialize multer for handling multipart/form-data

userRoute.put('/update-user', authenticate, updateUser);
userRoute.post('/update-avatar', authenticate, upload.single('image'), updateAvatar); // Add multer middleware
userRoute.post('/change-password-with-token', authenticate, changePasswordByToken);
userRoute.get('/:id', getUserById);
userRoute.post('/get-user-by-number-and-email', getUserByNumberAndEmail);
userRoute.post('/get-user-by-number-or-email', getUserByNumberOrEmail);
userRoute.post('/search', searchUsers); // Tìm kiếm người dùng

export default userRoute;
