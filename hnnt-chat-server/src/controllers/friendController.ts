import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        if (senderId === receiverId) {
            res.status(400).json({ message: 'Không thể gửi yêu cầu kết bạn cho chính mình!' });
            return;
        }

        //Check senderId and receiverId
        const sender = await prisma.account.findUnique({ where: { id: senderId } });
        const receiver = await prisma.account.findUnique({ where: { id: receiverId } });

        if (!sender || !receiver) {
            res.status(404).json({ message: 'Người dùng không tồn tại!' });
            return;
        }

        // Check existingRequest
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        // Check existingFriend
        const existingFriend = await prisma.friend.findFirst({
            where: {
                OR: [
                    { user1Id: senderId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: senderId },
                ],
            },
        });

        if (existingFriend) {
            res.status(400).json({ message: 'Các bạn đã là bạn của nhau!' });
            return;
        }

        if (existingRequest) {
            res.status(400).json({ message: 'Lời mời kết bạn đã tồn tại!' });
            return;
        }

        const friendRequest = await prisma.friendRequest.create({
            data: { senderId, receiverId },
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Cancel send friend request
export const cancelFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await prisma.friendRequest.findUnique({ where: { id } });

        if (!request) {
            res.status(400).json({ message: 'Lời mời kết bạn không tồn tại!' });
            return;
        }

        await prisma.friendRequest.delete({ where: { id } });

        res.status(200).json({ message: 'Đã hủy lời mời kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await prisma.friendRequest.findUnique({ where: { id } });

        if (!request) {
            res.status(400).json({ message: 'Lời mời kết bạn không tồn tại!' });
            return;
        }

        // Create Friend
        await prisma.friend.create({
            data: {
                user1Id: request.senderId,
                user2Id: request.receiverId,
            },
        });

        // Delete friendRequest
        await prisma.friendRequest.delete({ where: { id } });

        res.status(200).json({ message: 'Đã chấp nhận lời mời kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Delete friend
export const deleteFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await prisma.friend.findUnique({ where: { id } });

        if (!request) {
            res.status(400).json({ message: 'Thông tin bạn bè không tồn tại!' });
            return;
        }

        await prisma.friend.delete({ where: { id } });
        res.status(200).json({ message: 'Đã xóa kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};
