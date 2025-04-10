import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import redis from '../config/redis';
import dotenv from 'dotenv';
import { AuthRequest } from '../types/authRequest';

import { createClient } from 'redis';
const { v4: uuidv4 } = require('uuid');

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

        // Update trạng thái tài khoản
        await prisma.account.update({
            where: {
                id: user.id,
            },
            data: {
                status: 'active',
            },
        });

        // So sánh mật khẩu để xem đúng mật khẩu không
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

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, number, password, avatar, status, birthDate, location, gender, email } = req.body;

        const phoneRegex = /^(03|05|07|08|09|01|02)\d{8}$/; // Chỉ chấp nhận số hợp lệ ở VN

        if (!phoneRegex.test(number) || /^(\d)\1{9}$/.test(number)) {
            res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
            return;
        }

        // Kiểm tra tính hợp lệ của email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            res.status(400).json({ message: 'Email không hợp lệ!' });
            return;
        }

        if (!password || password.trim() === '') {
            res.status(400).json({ message: 'Mật khẩu không được để trống!' });
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự, gồm chữ, số và ký tự đặc biệt.',
            });
            return;
        }

        const existingUser = await prisma.account.findUnique({ where: { number } });
        if (existingUser) {
            res.status(400).json({ message: 'Số điện thoại này đã được sử dụng!' });
            return;
        }

        const existingEmail = await prisma.account.findUnique({ where: { email } });
        if (existingEmail) {
            res.status(400).json({ message: 'Email này đã được sử dụng!' });
            return;
        }

        // Gửi SMS xác nhận
        // const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 số
        // await sendSMS('+84935019843', `Mã OTP của bạn là: ${otpCode}`);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.account.create({
            data: {
                name: name && name.trim() !== '' ? name : 'Người dùng mới',
                number,
                email,
                password: hashedPassword,
                avatar:
                    avatar && avatar.trim() !== ''
                        ? avatar
                        : 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                status: status && status.trim() !== '' ? status : 'active',
                birthDate: birthDate ? new Date(birthDate) : new Date('2000-01-01'), // Chuyển đổi birthDate thành kiểu Date
                location: location ?? '',
                gender: gender && gender.trim() !== '' ? gender : 'Nam',
                currentAvatars: [], // Mảng trống mặc định
            },
        });

        res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// send OTP to email
let otpStore: { [key: string]: { otp: string; expiry: number } } = {};

// Gửi OTP qua email
const sendOTP = async (email: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã OTP xác thực tài khoản',
        text: `Mã OTP của bạn là: ${otp}. Vui lòng không chia sẻ mã này với bất kỳ ai khác.`,
        html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Vui lòng không chia sẻ mã này với bất kỳ ai khác.</p>`,
    };

    await transporter.sendMail(message);
};

// API gửi OTP qua email
export const sendOTPEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ message: 'Email không hợp lệ!' });
            return;
        }

        // Tạo OTP và thời gian hết hạn (5 phút)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // random 6 số OTP
        const expiry = Date.now() + 5 * 60 * 1000; // OTP hết hạn sau 5 phút

        // Lưu OTP vào bộ nhớ tạm thời (hoặc cơ sở dữ liệu)
        otpStore[email] = { otp, expiry };

        // Gửi OTP qua email
        await sendOTP(email, otp);

        res.status(200).json({ message: 'Mã OTP đã được gửi qua email!', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message, success: false });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ message: 'Email và OTP là bắt buộc!' });
            return;
        }

        // Kiểm tra xem OTP có tồn tại trong bộ nhớ hay không
        const storedOTP = otpStore[email];
        if (!storedOTP) {
            res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn!' });
            return;
        }

        // Kiểm tra xem OTP có đúng hay không và thời gian hết hạn
        if (storedOTP.otp !== otp) {
            res.status(400).json({ message: 'Mã OTP không chính xác!' });
            return;
        }

        if (Date.now() > storedOTP.expiry) {
            res.status(400).json({ message: 'Mã OTP đã hết hạn!' });
            return;
        }

        // Xóa OTP sau khi đã xác thực thành công
        // delete otpStore[email];

        res.status(200).json({ message: 'Xác thực OTP thành công!', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message, success: false });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, email } = req.body;

        // Kiểm tra tính hợp lệ của số điện thoại
        if (!number || !/^0\d{9}$/.test(number)) {
            res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
            return;
        }

        // Kiểm tra xem số có trong DB không
        const user = await prisma.account.findUnique({
            where: { number },
        });

        // Nếu không tìm thấy user, trả về lỗi
        if (!user) {
            res.status(404).json({ error: 'Số điện thoại chưa đăng ký' });
            return;
        }

        // So sánh email người dùng gửi lên với email trong DB
        if (user.email !== email) {
            res.status(400).json({ message: 'Email không khớp với số điện thoại này!' });
            return;
        }

        // Gửi OTP qua email
        await sendOTPEmail(req, res);
    } catch (error) {
        // Xử lý lỗi server
        res.status(500).json({ error: 'Không thể gửi OTP' });
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, newPassword } = req.body;
        if (!number || !newPassword) {
            res.status(400).json({ error: 'Thiếu thông tin' });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự, gồm chữ, số và ký tự đặc biệt.',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await prisma.account.update({
            where: { number },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công!', success: true });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi đặt lại mật khẩu', success: false });
    }
};

export const changePasswordByToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { currentPassWord, newPassword } = req.body;

        if (!currentPassWord || !newPassword) {
            res.status(400).json({ error: 'Thiếu thông tin' });
        }

        const userCurrent = await prisma.account.findUnique({
            where: { id: userId },
        });

        if (!userCurrent) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(currentPassWord, userCurrent.password);
        if (!isPasswordMatch) {
            res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/;

        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự, gồm chữ, số và ký tự đặc biệt.',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await prisma.account.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công!', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// đăng nhập bằng QR code
const redisClient = createClient();
redisClient.connect();

// Tạo loginTokenen
export const createLoginToken = async (req: Request, res: Response): Promise<void> => {
    const token = uuidv4();
    await redisClient.set(`qr:${token}`, 'PENDING', { EX: 60 });
    res.json({ token });
};

// Xác nhận đăng nhập từ app
export const confirmLoginToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, userId } = req.body;

        if (!token || !userId) {
            res.status(400).json({ message: 'Thiếu token hoặc userId' });
            return;
        }

        const status = await redisClient.get(`qr:${token}`);
        if (!status) {
            res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
            return;
        }

        if (status !== 'PENDING') {
            res.status(400).json({ message: 'Token không hợp lệ' });
            return;
        }

        const result = await redisClient.set(`qr:${token}`, `LOGGED_IN:${userId}`, { EX: 60 });
        if (result !== 'OK') {
            throw new Error('Không thể cập nhật trạng thái token');
        }

        res.status(200).json({
            message: 'Đăng nhập thành công',
            success: true,
        });
    } catch (error) {
        console.error('Lỗi confirmLoginToken:', error);
        if (!res.headersSent) {
            res.status(500).json({
                message: 'Lỗi server',
                error: (error as Error).message,
            });
        }
    }
};

// Web kiểm tra trạng thái
export const checkLoginStatus = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    const value = await redisClient.get(`qr:${token}`);
    if (!value) {
        res.json({ status: 'EXPIRED' });
        return;
    }
    if (value.startsWith('LOGGED_IN:')) {
        const userId = value.split(':')[1];
        res.json({ status: 'LOGGED_IN', userId });
        return;
    }
    res.json({ status: 'PENDING' });
    return;
};

// handleLOGIN

export const loginQR = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;

        // Kiểm tra số điện thoại có tồn tại không
        const user = await prisma.account.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(401).json({ message: 'Id không đúng' });
            return;
        }

        // Update trạng thái tài khoản
        await prisma.account.update({
            where: {
                id: user.id,
            },
            data: {
                status: 'active',
            },
        });

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
