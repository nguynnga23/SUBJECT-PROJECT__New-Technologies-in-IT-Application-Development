import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadToS3 } from '../utils/s3Uploader'; // Import the new utility
import multer from 'multer';

const prisma = new PrismaClient();
const upload = multer(); // Use multer for handling multipart/form-data

interface User {
    number: string;
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    status: string | null;
    birthDate: Date | null;
    location: string | null;
    gender: string;
    currentAvatars: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface AuthRequest extends Request {
    user?: User;
}

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { name, gender, birthDate } = req.body;

        if (!name && !gender && !birthDate) {
            res.status(400).json({ message: 'No data provided to update' });
        }

        const updatedUser = await prisma.account.update({
            where: { id: userId },
            data: { name, gender, birthDate: new Date(birthDate) },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'No file provided' });
            return;
        }

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
            res.status(400).json({ message: 'Invalid file type. Only images are allowed.' });
            return;
        }

        // Upload file to S3
        const key = `avatars/${userId}-${Date.now()}.jpg`;
        const uploadResult = await uploadToS3(file.buffer.toString('base64'), key); // Convert Buffer to Base64 string

        // Update user avatar in the database
        const updatedUser = await prisma.account.update({
            where: { id: userId },
            data: { avatar: uploadResult.Location },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
