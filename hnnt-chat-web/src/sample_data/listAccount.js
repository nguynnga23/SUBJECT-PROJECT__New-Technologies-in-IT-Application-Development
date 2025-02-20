const Accounts = [
    {
        id: 0,
        name: 'Nguyễn Lê Nhật Huy',
        number: '0000000000',
        password: '123',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
        status: 'string',
        birthDate: 'date',
        location: 'string',
        friends: [
            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                number: '1111111111',
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                number: '2222222222',
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
                number: '3333333333',
            },
        ],
        chats: [
            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                pin: true,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 1,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                        ],
                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Chào nha',
                        reactions: [
                            {
                                id: 1,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: true,
                    },
                    {
                        id: 3,
                        sender: 0,
                        content:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThyAh7n-Yc7cX6D-ZhFIq5L_IDvObDW-EMNQ&s',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'image',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                pin: false,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 2,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 2,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hôm nay bạn thế nào?',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 2,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:15',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
                pin: false,
                notify: true,
                kind: 'other',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 3,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hẹn gặp bạn sau!',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
        ],
    },
    {
        id: 1,
        name: 'Nguyễn Thị Nga',
        number: '1111111111',
        password: '123',
        avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
        status: 'string',
        birthDate: 'date',
        location: 'string',
        friends: [
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
                number: '0000000000',
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                number: '2222222222',
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
                number: '3333333333',
            },
        ],
        chats: [
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
                pin: true,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 0,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 1,
                                reaction: '❤️',
                                sum: 2,
                            },
                        ],
                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 1,
                        content: 'Chào nha',
                        reactions: [
                            {
                                id: 1,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: true,
                    },
                    {
                        id: 3,
                        sender: 0,
                        content:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThyAh7n-Yc7cX6D-ZhFIq5L_IDvObDW-EMNQ&s',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'image',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                pin: false,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 2,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 2,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hôm nay bạn thế nào?',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 2,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:15',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
                pin: false,
                notify: true,
                kind: 'other',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 3,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hẹn gặp bạn sau!',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Nguyễn Thiên Tứ',
        number: '2222222222',
        password: '123',
        avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
        status: 'string',
        birthDate: 'date',
        location: 'string',
        friends: [
            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                number: '1111111111',
            },
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
                number: '0000000000',
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
                number: '3333333333',
            },
        ],
        chats: [
            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                pin: true,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 1,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 2,
                                reaction: '❤️',
                                sum: 2,
                            },
                        ],
                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 2,
                        content: 'Chào nha',
                        reactions: [
                            {
                                id: 1,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: true,
                    },
                    {
                        id: 3,
                        sender: 2,
                        content:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThyAh7n-Yc7cX6D-ZhFIq5L_IDvObDW-EMNQ&s',
                        reactions: [
                            {
                                id: 2,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'image',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
                pin: false,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 2,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hôm nay bạn thế nào?',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:15',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
                pin: false,
                notify: true,
                kind: 'other',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 3,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hẹn gặp bạn sau!',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
        ],
    },

    {
        id: 3,
        name: 'Phạm Lê Thanh Nhiệt',
        number: '3333333333',
        password: '123',
        avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
        status: 'string',
        birthDate: 'date',
        location: 'string',
        friends: [
            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                number: '1111111111',
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                number: '2222222222',
            },
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
                number: '0000000000',
            },
        ],
        chats: [
            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                pin: true,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 1,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 3,
                                reaction: '❤️',
                                sum: 2,
                            },
                        ],
                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Chào nha',
                        reactions: [
                            {
                                id: 1,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: true,
                    },
                    {
                        id: 3,
                        sender: 0,
                        content:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThyAh7n-Yc7cX6D-ZhFIq5L_IDvObDW-EMNQ&s',
                        reactions: [
                            {
                                id: 3,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 1,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'image',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                pin: false,
                notify: true,
                kind: 'priority',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 2,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 3,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 2,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hôm nay bạn thế nào?',
                        reactions: [
                            {
                                id: 3,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 2,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:15',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
                pin: false,
                notify: true,
                kind: 'other',
                category: {},
                delete: [],
                messages: [
                    {
                        id: 1,
                        sender: 3,
                        content: 'Chào bạn',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '10:00',
                        delete: [],
                        destroy: false,
                    },
                    {
                        id: 2,
                        sender: 0,
                        content: 'Hẹn gặp bạn sau!',
                        reactions: [
                            {
                                id: 0,
                                reaction: '❤️',
                                sum: 2,
                            },
                            {
                                id: 3,
                                reaction: '🤣',
                                sum: 3,
                            },
                        ],

                        type: 'text',
                        time: '11:00',
                        delete: [],
                        destroy: false,
                    },
                ],
            },
        ],
    },
];

export default Accounts;
