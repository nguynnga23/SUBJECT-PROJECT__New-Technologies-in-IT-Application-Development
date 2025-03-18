import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create group chat
// POST /api/groups/create
// Body: { name: string, avatar: string, chatParticipant: [{ accountId: string}] }
export const createGroupChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, avatar, chatParticipant } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Tên nhóm không thể để trống!' });
            return;
        }

        const chat = await prisma.chat.create({
            data: {
                isGroup: true,
                name,
                avatar: avatar || 'default-avatar.png',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        const participants = chatParticipant.map((p: any, index: number) => ({
            chatId: chat.id,
            accountId: p.accountId,
            pin: false,
            notify: true,
            role: index === 0 ? 'LEADER' : p.role || 'MEMBER',
        }));

        await prisma.chatParticipant.createMany({ data: participants });
        res.status(201).json({ chat, participants });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Add member to group
// POST /api/groups/:groupId/add
// Body: { accountId: string}
export const addMemberToGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const chatId = req.params.groupId;
        const members = req.body;
        
        const membersWithChatId = members.map((member: any) => ({
            ...member,
            chatId: chatId,
            pin: false,
            notify: true,
            role: 'MEMBER',
        }));

        await prisma.chatParticipant.createMany({ data: membersWithChatId });
        res.status(201).json({ message: 'Thêm thành viên thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// export const pinMessage = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const messageId = req.params.messageId;
//         await prisma.message.update({ where: { id: messageId }, data: { pinned: true } });
//         res.status(200).json({ message: 'Tin nhắn đã được ghim!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
//     }
// };

// Mute group
// PUT /api/groups/mute
// Body: { chatId: string, accountId: string, notify: boolean }
export const muteGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId, accountId, notify } = req.body;
        await prisma.chatParticipant.update({
            where: { chatId_accountId: { chatId, accountId } },
            data: { notify },
        });
        res.status(200).json({ message: `Thông báo đã ${notify ? 'bật' : 'tắt'}!` });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Change group leader
// PUT /api/groups/role
// Body: {requesterId: string, chatId: string, accountId: string }
export const changeGroupRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId, accountId } = req.body;

        // Lấy ID của người thực hiện request
        // const requesterId = req.user?.accountId; // Giả sử req.user chứa thông tin người gửi request
        const requesterId = req.body.requesterId;

        if (!requesterId) {
            res.status(403).json({ message: 'Không xác định được người dùng!' });
        }

        // Kiểm tra xem người yêu cầu có phải là LEADER không
        const requester = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId: requesterId } },
            select: { role: true },
        });

        if (!requester || requester.role !== 'LEADER') {
            res.status(403).json({ message: 'Bạn không có quyền chuyển quyền nhóm!' });
        }

        // Kiểm tra xem accountId có tồn tại trong nhóm không
        const newLeader = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId } },
            select: { role: true },
        });

        if (!newLeader) {
            res.status(404).json({ message: 'Thành viên được chỉ định không tồn tại trong nhóm!' });
        }

        // Cập nhật quyền
        await prisma.$transaction([
            prisma.chatParticipant.update({
                where: { chatId_accountId: { chatId, accountId: requesterId } },
                data: { role: 'MEMBER' },
            }),
            prisma.chatParticipant.update({
                where: { chatId_accountId: { chatId, accountId } },
                data: { role: 'LEADER' },
            }),
        ]);

        res.status(200).json({ message: 'Chuyển quyền LEADER thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Leave group
// DELETE /api/groups/:groupId/leave
// Body: { accountId: string }
export const leaveGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const chatId = req.params.groupId;
        const accountId = req.body.accountId;

        // Kiểm tra xem người dùng có trong nhóm không
        const participant = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId } },
            select: { role: true },
        });

        if (!participant) {
            res.status(404).json({ message: 'Người dùng không tồn tại trong nhóm!' });
            return;
        }

        // Đếm số thành viên còn lại trong nhóm (trừ người rời đi)
        const remainingMembers = await prisma.chatParticipant.count({
            where: { chatId, accountId: { not: accountId } },
        });

        if (remainingMembers === 0) {
            // Nếu người cuối cùng rời nhóm, xóa luôn nhóm
            await prisma.$transaction([
                prisma.chatParticipant.deleteMany({ where: { chatId } }),
                prisma.message.deleteMany({ where: { chatId } }),
                prisma.chat.delete({ where: { id: chatId } }),
            ]);

            res.status(200).json({ message: 'Nhóm đã bị xóa!' });
            return;
        }

        if (participant && participant.role === 'LEADER') {
            
            const newLeader = await prisma.chatParticipant.findFirst({
                where: { chatId, accountId: { not: accountId } },
                orderBy: { accountId: 'asc' },
            });

            await prisma.$transaction([
                prisma.chatParticipant.delete({
                    where: { chatId_accountId: { chatId, accountId } },
                }),
                prisma.chatParticipant.update({
                    where: { chatId_accountId: { chatId, accountId: newLeader!.accountId } },
                    data: { role: 'LEADER' },
                }),
            ]);
        } else {
            // Nếu không phải LEADER, chỉ cần xóa thành viên khỏi nhóm
            await prisma.chatParticipant.delete({
                where: { chatId_accountId: { chatId, accountId } },
            });
        }

        res.status(200).json({ message: 'Rời nhóm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Disband group
// DELETE /api/groups/:groupId/disband
// Body: { requestId: string }
export const disbandGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const chatId = req.params.groupId;
        const requesterId = req.body.requestId;

        // Kiểm tra xem người yêu cầu có phải là LEADER không
        const requester = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId: requesterId } },
            select: { role: true },
        });

        if (!requester || requester.role !== 'LEADER') {
            res.status(403).json({ message: 'Bạn không có quyền giải tán nhóm!' });
            return;
        }

        await prisma.$transaction([
            prisma.chatParticipant.deleteMany({ where: { chatId } }),
            prisma.message.deleteMany({ where: { chatId } }),
            prisma.chat.delete({ where: { id: chatId } }),
        ]);

        res.status(200).json({ message: 'Nhóm đã bị giải tán!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};


