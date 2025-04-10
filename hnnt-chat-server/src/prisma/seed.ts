import { PrismaClient } from '@prisma/client';
import { log } from 'node:console';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');
    const hashedPassword = await bcrypt.hash('123', 10);

    const user1 = await prisma.account.create({
        data: {
            id: uuidv4(),
            name: 'Nguyễn Lê Nhật Huy',
            number: '1111111111',
            password: hashedPassword,
            email: 'email1@gmail.com',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
            status: 'no active',
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
            number: '2222222222',
            password: hashedPassword,
            email: 'email2@gmail.com',
            avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
            status: 'no active',
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
            number: '3333333333',
            password: hashedPassword,
            email: 'email3@gmail.com',
            avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
            status: 'no active',
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
            number: '4444444444',
            password: hashedPassword,
            email: 'email4@gmail.com',
            avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
            status: 'no active',
            birthDate: new Date('2003-04-20'),
            location: 'Tp. Hồ Chí Minh',
            gender: 'Nam',
            currentAvatars: [],
        },
    });

    //Friend
    const sendFriendRequestUser1ToUser2 = await prisma.friendRequest.create({
        data: {
            senderId: user1.id,
            receiverId: user2.id,
        },
    });

    // Chat (Group Chat)
    const groupChat = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: true,
            avatar: 'https://cdn-icons-png.flaticon.com/512/6387/6387947.png',
            name: 'Dev Team',
            participants: {
                create: [
                    {
                        accountId: user1.id,
                        role: 'LEADER', // User1 là chủ nhóm
                    },
                    {
                        accountId: user2.id,
                        role: 'MEMBER', // User2 là thành viên
                    },
                ],
            },
        },
    });

    //Chat
    const chat = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: false,
            participants: {
                create: [
                    {
                        accountId: user1.id,
                    },
                    {
                        accountId: user2.id,
                    },
                ],
            },
        },
    });

    // Message
    await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: chat.id,
            senderId: user1.id,
            content: 'Xin chào!',
            type: 'text',
            time: new Date().toISOString(),
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
