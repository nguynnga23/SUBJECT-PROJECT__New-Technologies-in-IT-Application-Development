import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadToS3 } from '../utils/s3Uploader'; // Import the new utility
import multer from 'multer';
import bcrypt from 'bcryptjs';

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
    pushToken: string | null;
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

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await prisma.account.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
};

export const getUserByNumberAndEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { number, email } = req.body;

        const existingAccount = await prisma.account.findFirst({
            where: {
                OR: [{ number: number }, { email: email }],
            },
        });

        if (existingAccount) {
            if (existingAccount.number === number && existingAccount.email === email) {
                res.status(400).json({ message: 'Số điện thoại và email đã tồn tại' });
            } else if (existingAccount.email === email) {
                res.status(400).json({ message: 'Email đã tồn tại' });
            } else if (existingAccount.number === number) {
                res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
            }
            return;
        }

        res.status(200).json({ exists: true, message: 'Số điện thoại và email chưa tồn tại' });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserByNumberOrEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { number, email } = req.body;
        if (!number && !email) {
            res.status(400).json({ message: 'Số điện thoại hoặc email phải được cung cấp' });
            return;
        }

        const user = await prisma.account.findFirst({
            where: {
                OR: [{ number: number }, { email: email }],
            },
        });

        if (!user) {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

export const searchByPhone = async (req: AuthRequest, res: Response): Promise<void> => {
    const { number } = req.body;
    const userId = req.user?.id;

    if (!number) {
        res.status(400).json({ message: 'Missing phone number' });
        return;
    }

    try {
        // const users = await prisma.account.findMany({
        //     where: {
        //         id: { not: userId },
        //         number: {
        //             contains: number,
        //             mode: 'insensitive',
        //         },
        //     },
        //     select: {
        //         id: true,
        //         name: true,
        //         number: true,
        //         avatar: true,
        //         sentFriendRequests: {
        //             where: { receiverId: userId },
        //             select: { id: true },
        //         },
        //         receivedFriendRequests: {
        //             where: { senderId: userId },
        //             select: { id: true },
        //         },
        //     },
        // });

        // const result = users.map((user) => {
        //     let status = 'none';
        //     let friendRequestId = null;

        //     if (user.sentFriendRequests.length > 0) {
        //         status = 'received';
        //         friendRequestId = user.sentFriendRequests[0].id;
        //     } else if (user.receivedFriendRequests.length > 0) {
        //         status = 'sent';
        //         friendRequestId = user.receivedFriendRequests[0].id;
        //     }

        //     return {
        //         id: user.id,
        //         name: user.name,
        //         number: user.number,
        //         avatar: user.avatar,
        //         status,
        //         friendRequestId, // ✅ đính kèm nếu có
        //     };
        // });

        const users = await prisma.account.findMany({
            where: {
                id: { not: userId },
                number: {
                    contains: number,
                    mode: 'insensitive',
                },
                AND: [
                    {
                        NOT: {
                            OR: [
                                {
                                    friends1: {
                                        some: { user2Id: userId },
                                    },
                                },
                                {
                                    friends2: {
                                        some: { user1Id: userId },
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                number: true,
                avatar: true,
                sentFriendRequests: {
                    where: { receiverId: userId },
                    select: { id: true },
                },
                receivedFriendRequests: {
                    where: { senderId: userId },
                    select: { id: true },
                },
            },
        });

        const result = users.map((user) => {
            let status = 'none';
            let friendRequestId = null;

            if (user.sentFriendRequests.length > 0) {
                status = 'received';
                friendRequestId = user.sentFriendRequests[0].id;
            } else if (user.receivedFriendRequests.length > 0) {
                status = 'sent';
                friendRequestId = user.receivedFriendRequests[0].id;
            }

            return {
                id: user.id,
                name: user.name,
                number: user.number,
                avatar: user.avatar,
                status,
                friendRequestId, // ✅ đính kèm nếu có
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    const { query, currentUserId } = req.body;

    try {
        const users = await prisma.account.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                    {
                        NOT: {
                            OR: [
                                { blockedUsers: { some: { blockedAccountId: currentUserId } } }, // Người dùng bị chặn bởi currentUserId
                                { blockedBy: { some: { blockerAccountId: currentUserId } } }, // Người dùng đã chặn currentUserId
                            ],
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
            },
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search users' });
    }
};
