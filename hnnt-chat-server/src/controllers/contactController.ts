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
