import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { promises } from 'dns';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ message: 'Đã đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, password } = req.body;
        const user = await prisma.account.findUnique({ where: { number } });

        if (!user) {
            res.status(400).json({ message: 'Tên đăng nhập không tồn tại!' });
            return;
        }
        console.log(user);

        res.status(200).json({ message: 'Đã đăng nhập thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {};
