import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';
import { s3 } from '../utils/s3Uploader';

const prisma = new PrismaClient();

// Create group chat
// POST /api/groups/create
// Body: { name: string, avatar: string, chatParticipant: [{ accountId: string}] }
export const createGroupChat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user?.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { name, avatar, chatParticipant } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Tên nhóm không thể để trống!' });
            return;
        }

        if (chatParticipant.length < 2) {
            res.status(400).json({ message: 'Nhóm phải có ít nhất 3 thành viên.' });
            return;
        }
        const filteredParticipants = chatParticipant.filter((p: any) => p.accountId !== requesterId);

        const chat = await prisma.chat.create({
            data: {
                isGroup: true,
                name,
                avatar: avatar || 'https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        const participants = [
            // Thêm người tạo nhóm (LEADER)
            {
                chatId: chat.id,
                accountId: requesterId,
                pin: false,
                notify: true,
                role: 'LEADER',
            },
            // Thêm các thành viên còn lại (MEMBER)
            ...filteredParticipants.map((p: any) => ({
                chatId: chat.id,
                accountId: p.accountId,
                pin: false,
                notify: true,
                role: 'MEMBER',
            })),
        ];

        await prisma.chatParticipant.createMany({ data: participants });
        res.status(201).json({ chat, participants });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Add member to group
// POST /api/groups/:groupId/add
// Body: { accountId: string}
export const addMemberToGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user?.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
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

// Pin message
// PUT /api/message/:messageId/pin
export const pinMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const messageId = req.params.messageId;

        // Lấy thông tin tin nhắn để xác định chatId
        const message = await prisma.message.findUnique({
            where: { id: messageId },
            select: { chatId: true },
        });

        if (!message) {
            res.status(404).json({ message: 'Tin nhắn không tồn tại!' });
            return;
        }

        // Ghim tin nhắn mới mà không gỡ ghim các tin nhắn khác
        await prisma.message.update({
            where: { id: messageId },
            data: { pin: true },
        });

        res.status(200).json({ message: 'Tin nhắn đã được ghim!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Pin message
// PUT /api/message/:messageId/un-pin
export const unPinMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const messageId = req.params.messageId;
        await prisma.message.update({ where: { id: messageId }, data: { pin: false } });
        res.status(200).json({ message: 'Tin nhắn đã được gỡ ghim!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// get pinned message
// GET /api/message/:chatId/show-pin
export const getPinnedMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const chatId = req.params.chatId; // Lấy chatId từ URL

        // Truy vấn tin nhắn được ghim trong nhóm chat
        const pinnedMessages = await prisma.message.findMany({
            where: { chatId, pin: true }, // Điều kiện: chatId và pin = true
            include: {
                sender: { select: { id: true, name: true, avatar: true } }, // Bao gồm thông tin người gửi
            },
        });

        if (pinnedMessages.length === 0) {
            res.status(404).json({ message: 'Không có tin nhắn nào được ghim.' });
            return;
        }

        res.status(200).json(pinnedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Mute group
// PUT /api/groups/mute
// Body: { chatId: string}
export const muteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user?.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { chatId } = req.body;
        const accountId = requesterId;
        // Kiểm tra xem người dùng có trong nhóm không
        const participant = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId } },
        });

        if (!participant) {
            res.status(403).json({ message: 'Bạn không phải thành viên của nhóm này' });
            return;
        }

        // Đảo trạng thái notify
        const newNotify = !participant.notify;

        await prisma.chatParticipant.update({
            where: { chatId_accountId: { chatId, accountId } },
            data: { notify: newNotify },
        });

        res.status(200).json({
            message: `Thông báo đã ${newNotify ? 'bật' : 'tắt'}!`,
            notify: newNotify,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Change group leader
// PUT /api/groups/role
// Body: {chatId: string, accountId: string }
export const changeGroupRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { chatId, accountId } = req.body;

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
export const leaveGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
        }

        const chatId = req.params.groupId;
        const accountId = requesterId;

        // 1. Kiểm tra participant và role
        const participant = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId } },
            select: { role: true },
        });
        if (!participant) {
            res.status(404).json({ message: 'Người dùng không tồn tại trong nhóm!' });
        }

        // 2. Đếm số thành viên còn lại
        const remainingMembers = await prisma.chatParticipant.count({
            where: { chatId, accountId: { not: accountId } },
        });
        if (remainingMembers === 0) {
            // Xóa nhóm nếu không còn thành viên
            await prisma.$transaction([
                prisma.chatParticipant.deleteMany({ where: { chatId } }),
                prisma.message.deleteMany({ where: { chatId } }),
                prisma.chat.delete({ where: { id: chatId } }),
            ]);
            res.status(200).json({ message: 'Nhóm đã bị xóa!' });
        }

        // 3. Nếu leader rời, tìm leader mới
        if (participant && participant.role === 'LEADER') {
            // a) groupBy để tìm sender cuối cùng (trừ chính leader)
            const recent = await prisma.message.groupBy({
                by: ['senderId'],
                where: { chatId, senderId: { not: accountId } },
                _max: { time: true },
                orderBy: { _max: { time: 'desc' } },
                take: 1,
            });

            let newLeaderAccountId: string;
            if (recent.length > 0 && recent[0]._max.time) {
                newLeaderAccountId = recent[0].senderId;
            } else {
                // b) fallback: chọn accountId nhỏ nhất
                const fallback = await prisma.chatParticipant.findFirst({
                    where: { chatId, accountId: { not: accountId } },
                    orderBy: { accountId: 'asc' },
                });
                newLeaderAccountId = fallback!.accountId;
            }

            // c) transaction: xóa leader cũ và update role mới
            await prisma.$transaction([
                prisma.chatParticipant.delete({
                    where: { chatId_accountId: { chatId, accountId } },
                }),
                prisma.chatParticipant.update({
                    where: { chatId_accountId: { chatId, accountId: newLeaderAccountId } },
                    data: { role: 'LEADER' },
                }),
            ]);
        } else {
            // 4. Nếu không phải leader thì chỉ xóa participant
            await prisma.chatParticipant.delete({
                where: { chatId_accountId: { chatId, accountId } },
            });
        }

        res.status(200).json({ message: 'Rời nhóm thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Disband group
// DELETE /api/groups/:groupId/disband
export const disbandGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const chatId = req.params.groupId;
        const accountId = requesterId;

        // Kiểm tra xem người yêu cầu có phải là LEADER không
        const requester = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId } },
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

//LEADER kick member
// DELETE /api/groups/:groupId/kick
// Body: { accountId: string }
export const kickMember = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const chatId = req.params.groupId;
        const { accountId } = req.body;

        // Kiểm tra xem người yêu cầu có phải là LEADER không
        const requester = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId: requesterId } },
            select: { role: true },
        });

        if (!requester || requester.role !== 'LEADER') {
            res.status(403).json({ message: 'Bạn không có quyền xóa thành viên khỏi nhóm!' });
            return;
        }

        const member = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId } },
        });

        if (!member) {
            res.status(404).json({ message: 'Thành viên không tồn tại trong nhóm!' });
            return;
        }

        await prisma.chatParticipant.delete({
            where: { chatId_accountId: { chatId, accountId } },
        });

        res.status(200).json({ message: 'Xóa thành viên khỏi nhóm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// Update group name
// PUT /api/groups/:groupId/edit-name
// Body: { name: string }
export const updateGroupName = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const chatId = req.params.groupId;
        const { name } = req.body;

        // Kiểm tra xem người yêu cầu có phải là LEADER không
        const requester = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId: requesterId } },
            select: { role: true },
        });

        if (!requester || requester.role !== 'LEADER') {
            res.status(403).json({ message: 'Bạn không có quyền đổi tên nhóm!' });
            return;
        }

        await prisma.chat.update({
            where: { id: chatId },
            data: { name },
        });

        res.status(200).json({ message: 'Đổi tên nhóm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

//upload image to s3
// POST /api/groups/upload
// Body: { file: File }
export const uploadFileToS3 = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('Received request for file upload');
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        console.log('File received:', file.originalname);

        const fileName = `${Date.now()}-${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: `avatar/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const result = await s3.upload(params).promise();
        console.log('Upload successful:', result);

        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: result.Location,
            key: result.Key,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error });
    }
};

//Update group avatar
// PUT /api/groups/:groupId/edit-avatar
// Body: { avatar: string }
export const updateGroupAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user.id;
        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const chatId = req.params.groupId;
        const { avatar } = req.body;

        // Kiểm tra xem người yêu cầu có phải là LEADER không
        const requester = await prisma.chatParticipant.findUnique({
            where: { chatId_accountId: { chatId, accountId: requesterId } },
            select: { role: true },
        });

        if (!requester || requester.role !== 'LEADER') {
            res.status(403).json({ message: 'Bạn không có quyền đổi ảnh nhóm!' });
            return;
        }

        await prisma.chat.update({
            where: { id: chatId },
            data: { avatar },
        });

        res.status(200).json({ message: 'Đổi ảnh nhóm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};
