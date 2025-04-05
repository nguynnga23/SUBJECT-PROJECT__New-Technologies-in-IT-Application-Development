import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { AuthRequest } from '../types/authRequest';
import redis from '../config/redis';

dotenv.config();
const prisma = new PrismaClient();

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Kiểm tra token có trong blacklist không
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            res.status(401).json({ message: 'Token đã bị vô hiệu hóa' });
            return;
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
            const user = await prisma.account.findUnique({ where: { id: decoded.id } });

            if (!user) {
                res.status(401).json({ message: 'Người dùng không tồn tại' });
                return;
            }
            req.user = user;
        } catch (error) {
            res.status(403).json({ message: 'Invalid token' });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
};
