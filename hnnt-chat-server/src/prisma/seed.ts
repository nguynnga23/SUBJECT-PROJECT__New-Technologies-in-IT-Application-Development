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
    for (let i = 5; i <= 50; i++) {
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

    // Additional Categories
    const categories: { id: string; name: string; color: string; accountId: string }[] = [];
    for (let i = 3; i <= 10; i++) {
        const category = await prisma.category.create({
            data: {
                id: uuidv4(),
                name: `Category ${i}`,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                accountId: users[i % users.length].id,
            },
        });
        categories.push(category);
    }

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

    // Additional Friend Requests
    for (let i = 0; i < 20; i++) {
        await prisma.friendRequest.create({
            data: {
                senderId: users[i % users.length].id,
                receiverId: users[(i + 1) % users.length].id,
            },
        });
    }

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

    // Additional Friends
    for (let i = 0; i < 20; i++) {
        await prisma.friend.create({
            data: {
                user1Id: users[i % users.length].id,
                user2Id: users[(i + 2) % users.length].id,
            },
        });
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
            avatar: 'https://i.pravatar.cc/150?img=200',
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
                        categoryId: categories[index % categories.length]?.id,
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

    // Additional Private Chats
    for (let i = 0; i < 10; i++) {
        await prisma.chat.create({
            data: {
                id: uuidv4(),
                isGroup: false,
                participants: {
                    create: [
                        { accountId: users[i % users.length].id },
                        { accountId: users[(i + 1) % users.length].id },
                    ],
                },
            },
        });
    }

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

    // Additional Messages
    for (let i = 0; i < 30; i++) {
        await prisma.message.create({
            data: {
                id: uuidv4(),
                chatId: i % 2 === 0 ? privateChat1.id : groupChat1.id,
                senderId: users[i % users.length].id,
                content: `Message ${i + 1}`,
                type: 'text',
            },
        });
    }

    // Additional Messages for Nguyễn Thị Nga
    await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: ngaGroup1.id,
            senderId: user2.id,
            content: 'Hello everyone, welcome to the study group!',
            type: 'text',
        },
    });
    await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: ngaGroup2.id,
            senderId: user2.id,
            content: "Let's plan our next meetup!",
            type: 'text',
        },
    });
    await prisma.message.create({
        data: {
            id: uuidv4(),
            chatId: privateChat2.id,
            senderId: user2.id,
            content: 'Hi, how are you doing?',
            type: 'text',
        },
    });

    // Additional Messages in Existing Chats
    for (let i = 0; i < 10; i++) {
        await prisma.message.create({
            data: {
                id: uuidv4(),
                chatId: ngaGroup1.id,
                senderId: users[i % users.length].id,
                content: `Message from user ${i + 1} in Nga's group.`,
                type: 'text',
            },
        });
    }

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

    // Additional Reactions
    for (let i = 0; i < 10; i++) {
        await prisma.reaction.create({
            data: {
                id: uuidv4(),
                messageId: message1.id,
                userId: users[i % users.length].id,
                reaction: i % 2 === 0 ? '👍' : '❤️',
            },
        });
    }

    // Additional Friends for Nguyễn Thị Nga
    await prisma.friend.create({
        data: {
            user1Id: user2.id,
            user2Id: user3.id,
        },
    });
    await prisma.friend.create({
        data: {
            user1Id: user2.id,
            user2Id: user4.id,
        },
    });
    await prisma.friend.create({
        data: {
            user1Id: user2.id,
            user2Id: users[6].id,
        },
    });

    // Additional Friend Requests for Nguyễn Thị Nga
    await prisma.friendRequest.create({
        data: {
            senderId: user2.id,
            receiverId: user1.id,
        },
    });
    await prisma.friendRequest.create({
        data: {
            senderId: users[7].id,
            receiverId: user2.id,
        },
    });
    await prisma.friendRequest.create({
        data: {
            senderId: users[8].id,
            receiverId: user2.id,
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
