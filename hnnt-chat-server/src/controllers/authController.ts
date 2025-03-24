import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../config/redis';
import dotenv from 'dotenv';
import { AuthRequest } from '../types/authRequest';

dotenv.config();

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, password } = req.body;

        // Kiểm tra số điện thoại có tồn tại không
        const user = await prisma.account.findUnique({
            where: { number },
        });

        if (!user) {
            res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
            return;
        }
        await prisma.account.update({
            where: {
                id: user.id,
            },
            data: {
                status: 'active',
            },
        });

        // So sánh mật khẩu
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password;
        if (!isMatch) {
            res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
            return;
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user.id, number: user.number, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' },
        );

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(400).json({ message: 'Không có token để logout' });
            return;
        }
        await prisma.account.update({
            where: {
                id: req.user.id,
            },
            data: {
                status: 'no active',
            },
        });

        // Giải mã token để lấy thời gian hết hạn
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);

        // Lưu token vào Redis blacklist
        await redis.setex(`blacklist:${token}`, expiryTime, 'blacklisted');

        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
