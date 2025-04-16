import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

// Get list group chat by userId
export const getListGroupChatByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        const groupChats = await prisma.chat.findMany({
            where: {
                isGroup: true,
                participants: {
                    some: { accountId: userId },
                },
            },
            include: {
                participants: {
                    include: {
                        account: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                status: true,
                            },
                        },
                        category: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        res.status(200).json(groupChats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

export const getChatByFriendId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // ID of the logged-in user
        const friendId = req.params.friendId; // ID of the friend

        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Find the chat between the user and the friend
        const chat = await prisma.chat.findFirst({
            where: {
                isGroup: false,
                participants: {
                    every: {
                        accountId: { in: [userId, friendId] },
                    },
                },
            },
            include: {
                participants: true,
                messages: {
                    orderBy: { time: 'desc' },
                    take: 20, // Limit to the last 20 messages
                },
            },
        });

        if (!chat) {
            res.status(404).json({ message: 'Không tìm thấy đoạn chat với bạn này!' });
            return;
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};
