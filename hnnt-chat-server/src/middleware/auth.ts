import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { AuthRequest } from '../types/authRequest';

dotenv.config();
const prisma = new PrismaClient();

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await prisma.account.findUnique({ where: { id: decoded.id } });

        if (!user) {
            res.status(401).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
