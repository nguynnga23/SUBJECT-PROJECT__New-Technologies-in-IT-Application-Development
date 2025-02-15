const data = [
    {
        id: 1,
        name: 'Nguyen Van A',
        number: '111111111',
        avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
        pin: true,
        notify: true,
        kind: 'priority',
        category: '',
        categoryColor: '',
        status: '',
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
                delete: false,
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
                delete: false,
                destroy: true,
            },
            {
                id: 3,
                sender: 0,
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
                delete: false,
                destroy: false,
            },
        ],
    },
    {
        id: 2,
        name: 'Tran Thi B',
        number: '222222222',
        avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
        pin: false,
        notify: true,
        kind: 'priority',
        category: '',
        categoryColor: '',
        status: '',
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
                delete: false,
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
                delete: false,
                destroy: false,
            },
        ],
    },
    {
        id: 3,
        name: 'Le Van C',
        number: '333333333',
        avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
        pin: false,
        notify: true,
        kind: 'other',
        category: '',
        categoryColor: '',
        status: '',
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
                delete: false,
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
                delete: false,
                destroy: false,
            },
        ],
    },
];

export { data };
