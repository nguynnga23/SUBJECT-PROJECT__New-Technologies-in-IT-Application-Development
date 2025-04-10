import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('123456789', 10);
    const hashedPassword2 = await bcrypt.hash('123456789', 10);
    const hashedPassword3 = await bcrypt.hash('123456789', 10);
    const hashedPassword4 = await bcrypt.hash('123456789', 10);

    // Accounts
    const user1 = await prisma.account.create({
        data: {
            id: uuidv4(),
            name: 'Nguyễn Lê Nhật Huy',
            number: '0776466188',
            password: hashedPassword1,
            email: 'email1@gmail.com',
            avatar: 'https://example.com/avatar1.png',
            status: 'active',
            birthDate: new Date('2003-09-20'),
            location: 'Tây Ninh',
            gender: 'Nam',
            currentAvatars: [],
        },
    });
    const user2 = await prisma.account.create({
        data: {
            id: uuidv4(),
            name: 'Nguyễn Thị Nga',
            number: '0776466189',
            password: hashedPassword2,
            email: 'nguyennga200x@gmail.com',
            avatar: 'https://example.com/avatar2.png',
            status: 'active',
            birthDate: new Date('2003-09-23'),
            location: 'Ninh Bình',
            gender: 'Nữ',
            currentAvatars: [],
        },
    });
    const user3 = await prisma.account.create({
        data: {
            id: uuidv4(),
            name: 'Nguyễn Thiên Tứ',
            number: '0776466187',
            password: hashedPassword3,
            email: 'email3@gmail.com',
            avatar: 'https://example.com/avatar3.png',
            status: 'active',
            birthDate: new Date('2003-01-02'),
            location: 'Tp. Hồ Chí Minh',
            gender: 'Nam',
            currentAvatars: [],
        },
    });
    const user4 = await prisma.account.create({
        data: {
            id: uuidv4(),
            name: 'Phạm Lê Thanh Nhiệt',
            number: '0776466186',
            password: hashedPassword4,
            email: 'email4@gmail.com',
            avatar: 'https://example.com/avatar4.png',
            status: 'active',
            birthDate: new Date('2003-04-20'),
            location: 'Tp. Hồ Chí Minh',
            gender: 'Nam',
            currentAvatars: [],
        },
    });

    // Categories
    const category1 = await prisma.category.create({
        data: {
            id: uuidv4(),
            name: 'Work',
            color: '#FF5733',
            accountId: user1.id,
        },
    });
    const category2 = await prisma.category.create({
        data: {
            id: uuidv4(),
            name: 'Friends',
            color: '#33FF57',
            accountId: user2.id,
        },
    });

    // Friend Requests
    await prisma.friendRequest.create({
        data: {
            senderId: user1.id,
            receiverId: user2.id,
        },
    });
    await prisma.friendRequest.create({
        data: {
            senderId: user3.id,
            receiverId: user1.id,
        },
    });
    await prisma.friendRequest.create({
        data: {
            senderId: user4.id,
            receiverId: user2.id,
        },
    });

    // Friends
    await prisma.friend.create({
        data: {
            user1Id: user1.id,
            user2Id: user2.id,
        },
    });
    await prisma.friend.create({
        data: {
            user1Id: user3.id,
            user2Id: user4.id,
        },
    });

    // Group Chat
    const groupChat1 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: true,
            name: 'Dev Team',
            avatar: 'https://example.com/group-avatar1.png',
            participants: {
                create: [
                    {
                        accountId: user1.id,
                        role: 'LEADER',
                        categoryId: category1.id,
                    },
                    {
                        accountId: user2.id,
                        role: 'MEMBER',
                    },
                    {
                        accountId: user3.id,
                        role: 'MEMBER',
                    },
                ],
            },
        },
    });
    const groupChat2 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: true,
            name: 'Friends Group',
            avatar: 'https://example.com/group-avatar2.png',
            participants: {
                create: [
                    {
                        accountId: user2.id,
                        role: 'LEADER',
                        categoryId: category2.id,
                    },
                    {
                        accountId: user4.id,
                        role: 'MEMBER',
                    },
                ],
            },
        },
    });

    // Private Chats
    const privateChat1 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: false,
            participants: {
                create: [{ accountId: user1.id }, { accountId: user3.id }],
            },
        },
    });
    const privateChat2 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: false,
            participants: {
                create: [{ accountId: user2.id }, { accountId: user4.id }],
            },
        },
    });

    // Messages
    const message1 = await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: privateChat1.id,
            senderId: user1.id,
            content: 'Hello, how are you?',
            type: 'text',
        },
    });
    const message2 = await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: privateChat1.id,
            senderId: user3.id,
            content: 'I am good, thank you!',
            type: 'text',
        },
    });
    const message3 = await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: groupChat1.id,
            senderId: user2.id,
            content: 'Welcome to the Dev Team!',
            type: 'text',
        },
    });

    // Reactions
    await prisma.reaction.create({
        data: {
            id: uuidv4(),
            messageId: message1.id,
            userId: user3.id,
            reaction: '👍',
        },
    });
    await prisma.reaction.create({
        data: {
            id: uuidv4(),
            messageId: message3.id,
            userId: user1.id,
            reaction: '❤️',
        },
    });

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
