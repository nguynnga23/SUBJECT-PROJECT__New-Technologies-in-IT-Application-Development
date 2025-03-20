import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../config/redis';
import dotenv from 'dotenv';

import { sendSMS } from '../config/sendSMS';

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

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = password === user.password;
        if (!isMatch) {
            res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
            return;
        }

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error('Thiếu ACCESS_TOKEN_SECRET_SIGNATURE trong biến môi trường!');
        }

        // Tạo JWT token
        const token = jwt.sign({ id: user.id, number: user.number, name: user.name }, secretKey as string, {
            expiresIn: '7d',
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(400).json({ message: 'Không có token để logout' });
            return;
        }

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

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, number, password, avatar, status, birthDate, location, gender } = req.body;

        const existingUser = await prisma.account.findUnique({ where: { number } });
        if (existingUser) {
            res.status(400).json({ message: 'Số điện thoại này đã được sử dụng!' });
            return;
        }

        // Gửi SMS xác nhận
        // const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 số
        // await sendSMS('+84935019843', `Mã OTP của bạn là: ${otpCode}`);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.account.create({
            data: {
                name: name ?? 'Người dùng mới',
                number,
                password: hashedPassword,
                avatar: avatar ?? 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                status: status ?? 'active',
                birthDate: birthDate ? new Date(birthDate) : new Date('2000-01-01'), // Chuyển đổi birthDate thành kiểu Date
                location: location ?? '',
                gender: gender ?? 'Nam',
                currentAvatars: [], // Mảng trống mặc định
            },
        });

        res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {};
