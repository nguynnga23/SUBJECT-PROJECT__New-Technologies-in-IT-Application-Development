import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { promises } from 'dns';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import ms from 'ms';
import { JwtProvider } from '../providers/JwtProvider';

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
        // Tạo access token
        const secretKey = process.env.ACCESS_TOKEN_SECRET_SIGNATURE;
        if (!secretKey) {
            throw new Error('Thiếu ACCESS_TOKEN_SECRET_SIGNATURE trong biến môi trường!');
        }
        const accessToken = await JwtProvider.generateToken(userInfo, secretKey, '1h');

        // Tạo refresh token
        const refreshKey = process.env.REFRESH_TOKEN_SECRET_SIGNATURE;
        if (!refreshKey) {
            throw new Error('Thiếu REFRESH_TOKEN_SECRET_SIGNATURE trong biến môi trường!');
        }
        const refreshToken = await JwtProvider.generateToken(userInfo, refreshKey, '14 days');

        //Tạo cookie cho accesstoken token, để thời gian tối đa là 14 ngày vì nếu nó khác thời gian sống token
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });

        //Tạo cookie cho refresh token, để thời gian sống là 14 ngày
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });

        // chổ này là render ra nè
        res.status(200).json({ message: 'Đã đăng nhập thành công!', user, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'none' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });

        res.status(200).json({ message: 'Đã đăng xuất!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshTokenFromCookie: string | undefined = req.cookies?.refreshToken;
        if (!refreshTokenFromCookie) {
            res.status(401).json({ message: 'Không tìm thấy refresh token!' });
            return;
        }

        const refreshKey: string | undefined = process.env.REFRESH_TOKEN_SECRET_SIGNATURE;
        if (!refreshKey) {
            throw new Error('Thiếu REFRESH_TOKEN_SECRET_SIGNATURE trong biến môi trường!');
        }

        const refreshTokenDecoded = await JwtProvider.verifyToken(refreshTokenFromCookie, refreshKey);
        if (!refreshTokenDecoded || !refreshTokenDecoded.id || !refreshTokenDecoded.name) {
            res.status(403).json({ message: 'Refresh token không hợp lệ!' });
            return;
        }

        const userInfo = {
            id: refreshTokenDecoded.id as string,
            name: refreshTokenDecoded.name as string,
        };

        // Tạo access token mới
        const accessKey: string | undefined = process.env.ACCESS_TOKEN_SECRET_SIGNATURE;
        if (!accessKey) {
            throw new Error('Thiếu ACCESS_TOKEN_SECRET_SIGNATURE trong biến môi trường!');
        }
        const accessToken = await JwtProvider.generateToken(userInfo, accessKey, '1h');

        // Cập nhật accessToken vào cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('1h'),
        });

        res.status(200).json({ message: 'Refresh Token API success.', accessToken });
    } catch (error) {
        res.status(500).json({
            message: 'Refresh Token API failed!',
            error: (error as Error).message,
        });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {};
