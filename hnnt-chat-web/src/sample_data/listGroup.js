const groups = [
    {
        id: 4,
        name: 'Công nghệ mới',
        avatar: 'https://cdn-icons-png.flaticon.com/512/6387/6387947.png',
        pin: true,
        notify: true,
        kind: 'priority',
        category: '',
        categoryColor: '',
        delete: [],
        group: true,
        leader: 0,
        members: [
            {
                id: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZIA8q5YZgirXxhzjkXkoVG1LuwLd4WYkjg&s',
            },

            {
                id: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
            },
            {
                id: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
            },
            {
                id: 3,
                name: 'Phạm Lê Thanh Nhiệt',
                avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
            },
        ],
        messages: [
            {
                id: 1,
                sender: 1,
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
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
                sender: 1,
                content: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_OnnNWRipITQo-bd-dGcXJzonSdG-M8YmQ&s',
                name: 'Nguyễn Thị Nga',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
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

                type: 'image',
                time: '11:00',
                delete: [],
                destroy: false,
            },
            {
                id: 3,
                sender: 2,
                name: 'Nguyễn Thiên Tứ',
                avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
                content: 'Sao',
                reactions: [
                    {
                        id: 1,
                        reaction: '❤️',
                        sum: 2,
                    },
                    {
                        id: 1,
                        reaction: '🤣',
                        sum: 1,
                    },
                ],

                type: 'text',
                time: '11:00',
                delete: [],
                destroy: false,
            },
            {
                id: 4,
                sender: 0,
                name: 'Nguyễn Lê Nhật Huy',
                avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
                content: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThyAh7n-Yc7cX6D-ZhFIq5L_IDvObDW-EMNQ&s',
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
];

export default groups;
