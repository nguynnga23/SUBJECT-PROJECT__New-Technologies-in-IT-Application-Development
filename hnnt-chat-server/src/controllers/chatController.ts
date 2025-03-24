import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

export const GetChatOfUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

        // Lấy danh sách các chat mà user tham gia
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { accountId: userId },
                },
            },
            include: {
                participants: {
                    include: {
                        account: { select: { id: true, name: true, avatar: true, status: true } },
                        category: true,
                    },
                },
                messages: {
                    orderBy: { time: 'desc' },
                    take: 1, // Lấy tin nhắn mới nhất
                    include: {
                        sender: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const PinChatOfUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }
        if (!chatId) {
            res.status(401).json({ message: 'Bạn không được phép truy cập đoạn chat này' });
            return;
        }

        // Lấy đoạn chat mà user tham gia
        const chat = await prisma.chatParticipant.findFirst({
            where: {
                chatId,
                accountId: userId,
            },
        });
        if (!chat) {
            res.status(403).json({ message: 'Bạn không có quyền chat này.' });
            return;
        }
        await prisma.chatParticipant.update({
            where: {
                id: chat.id,
            },
            data: {
                pin: !chat.pin,
            },
        });

        res.status(200).json({ message: 'Đã cập nhật ghim' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
export const NotifyChatOfUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }
        if (!chatId) {
            res.status(401).json({ message: 'Bạn không được phép truy cập đoạn chat này' });
            return;
        }

        // Lấy đoạn chat mà user tham gia
        const chat = await prisma.chatParticipant.findFirst({
            where: {
                chatId,
                accountId: userId,
            },
        });
        if (!chat) {
            res.status(403).json({ message: 'Bạn không có quyền chat này.' });
            return;
        }
        await prisma.chatParticipant.update({
            where: {
                id: chat.id,
            },
            data: {
                notify: !chat.notify,
            },
        });

        res.status(200).json({ message: 'Đã cập nhật ghim' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const addCategoryToChat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;
        const { categoryId } = req.body;

        if (!chatId) {
            res.status(401).json({ message: 'Bạn không được phép truy cập đoạn chat này' });
            return;
        }
        if (!categoryId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

        // Lấy đoạn chat mà user tham gia
        const chat = await prisma.chatParticipant.findFirst({
            where: {
                chatId: chatId,
                accountId: userId,
            },
        });
        if (!chat) {
            res.status(403).json({ message: 'Bạn không có quyền chat này.' });
            return;
        }

        const newCategoryId = chat.categoryId === categoryId ? null : categoryId;

        await prisma.chatParticipant.update({
            where: {
                id: chat.id,
            },
            data: {
                categoryId: newCategoryId,
            },
        });

        res.status(200).json({ message: 'Đã cập nhật ghim' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
