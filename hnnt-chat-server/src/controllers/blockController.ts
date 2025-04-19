import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const blockUser = async (req: Request, res: Response) => {
    const { blockerAccountId, blockedAccountId } = req.body;

    try {
        // Hủy mối quan hệ bạn bè nếu tồn tại
        await prisma.friend.deleteMany({
            where: {
                OR: [
                    { user1Id: blockerAccountId, user2Id: blockedAccountId },
                    { user1Id: blockedAccountId, user2Id: blockerAccountId },
                ],
            },
        });

        // Hủy lời mời kết bạn nếu tồn tại
        await prisma.friendRequest.deleteMany({
            where: {
                OR: [
                    { senderId: blockerAccountId, receiverId: blockedAccountId },
                    { senderId: blockedAccountId, receiverId: blockerAccountId },
                ],
            },
        });

        // Thực hiện chặn người dùng
        const block = await prisma.blockedUser.create({
            data: {
                blockerAccountId,
                blockedAccountId,
            },
        });

        res.status(201).json(block);
    } catch (error) {
        res.status(500).json({ error: 'Failed to block user' });
    }
};

export const unblockUser = async (req: Request, res: Response) => {
    const { blockerAccountId, blockedAccountId } = req.body;

    try {
        await prisma.blockedUser.delete({
            where: {
                blockerAccountId_blockedAccountId: {
                    blockerAccountId,
                    blockedAccountId,
                },
            },
        });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unblock user' });
    }
};

export const getBlockedUsers = async (req: Request, res: Response) => {
    const { blockerAccountId } = req.params;

    try {
        const blockedUsers = await prisma.blockedUser.findMany({
            where: { blockerAccountId },
            include: { blocked: true },
        });
        res.status(200).json(blockedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blocked users' });
    }
};
