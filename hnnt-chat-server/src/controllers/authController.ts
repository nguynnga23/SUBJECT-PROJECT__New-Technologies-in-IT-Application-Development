import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { promises } from 'dns';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, number, password, avatar, status, birthDate, location, gender } = req.body;

        const existingUser = await prisma.account.findUnique({ where: { number } });
        if (existingUser) {
            res.status(400).json({ message: 'Số điện thoại này đã được sử dụng!' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.account.create({
            data: {
                name,
                number,
                password: hashedPassword,
                avatar,
                status,
                birthDate: new Date(birthDate), // Chuyển đổi birthDate thành kiểu Date
                location,
                gender,
                currentAvatars: [], // Mảng trống mặc định
            },
        });

        res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
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

        const isPassword = await bcrypt.compare(password, user.password);
        if (number !== user?.number || !isPassword) {
            res.status(403).json({ message: 'Tài khoản hoặc mật khẩu của không bạn đúng!' });
            return;
        }

        const userInfo = {
            id: user.id,
            name: user.name,
        };

        // const isMatch = await bcrypt.compare(password, user.password); // thực hiện so sánh mật khẩu với mặt khẩu đã băm trong db
        // if (!isMatch) {
        //     res.status(400).json({ message: 'Mật khẩu không đúng!' });
        //     return;
        // }
        // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' }); // tạo token

        // res.status(200).json({ message: 'Đăng nhập thành công!', token });
        res.status(200).json({ message: 'Đã đăng nhập thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {};
