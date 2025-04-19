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
            avatar: 'https://i.pravatar.cc/150?img=9',
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
            avatar: 'https://i.pravatar.cc/150?img=8',
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
            avatar: 'https://i.pravatar.cc/150?img=7',
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
            avatar: 'https://i.pravatar.cc/150?img=7',
            status: 'active',
            birthDate: new Date('2003-04-20'),
            location: 'Tp. Hồ Chí Minh',
            gender: 'Nam',
            currentAvatars: [],
        },
    });

    // Additional Users
    const users = [];
    for (let i = 5; i <= 10; i++) {
        const hashedPassword = await bcrypt.hash('123456789', 10);
        const birthDate = new Date('2003-04-20'); // Generate valid date
        const user = await prisma.account.create({
            data: {
                id: uuidv4(),
                name: `User ${i}`,
                number: `077646${(1000 + i).toString().padStart(4, '0')}`, // Ensure 11-digit numbers
                password: hashedPassword,
                email: `user${i}@example.com`,
                avatar: `https://i.pravatar.cc/150?img=${i}`,
                status: 'active',
                birthDate, // Use valid date
                location: `Location ${i}`,
                gender: i % 2 === 0 ? 'Nam' : 'Nữ',
                currentAvatars: [],
            },
        });
        users.push(user);
    }

    // Group Chat
    const groupChat1 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: true,
            name: 'Dev Team',
            avatar: 'https://i.pravatar.cc/150?img=201',
            participants: {
                create: [
                    {
                        accountId: user1.id,
                        role: 'LEADER',
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
            avatar: 'https://i.pravatar.cc/150?img=200',
            participants: {
                create: [
                    {
                        accountId: user2.id,
                        role: 'LEADER',
                    },
                    {
                        accountId: user4.id,
                        role: 'MEMBER',
                    },
                ],
            },
        },
    });

    // Additional Group Chats
    for (let i = 3; i <= 5; i++) {
        await prisma.chat.create({
            data: {
                id: uuidv4(),
                isGroup: true,
                name: `Group Chat ${i}`,
                avatar: `https://i.pravatar.cc/150?img=${i + 100}`,
                participants: {
                    create: users.slice(i, i + 3).map((user, index) => ({
                        accountId: user.id,
                        role: index === 0 ? 'LEADER' : 'MEMBER',
                    })),
                },
            },
        });
    }

    // Additional Groups for Nguyễn Thị Nga
    const ngaGroup1 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: true,
            name: "Nga's Study Group",
            avatar: 'https://i.pravatar.cc/150?img=20',
            participants: {
                create: [
                    { accountId: user2.id, role: 'LEADER' },
                    { accountId: user1.id, role: 'MEMBER' },
                    { accountId: user3.id, role: 'MEMBER' },
                ],
            },
        },
    });
    const ngaGroup2 = await prisma.chat.create({
        data: {
            id: uuidv4(),
            isGroup: true,
            name: "Nga's Friends",
            avatar: 'https://i.pravatar.cc/150?img=21',
            participants: {
                create: [
                    { accountId: user2.id, role: 'LEADER' },
                    { accountId: user4.id, role: 'MEMBER' },
                    { accountId: users[5].id, role: 'MEMBER' },
                ],
            },
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
