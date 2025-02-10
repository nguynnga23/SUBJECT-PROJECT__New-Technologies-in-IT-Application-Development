const data = [
    {
        id: 1,
        name: 'Nguyen Van A',
        avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
        pin: true,
        note: true,
        kind: 'priority',
        messages: [
            {
                sender: 1,
                content: 'Chào bạn',
                time: '10:00 AM',
            },
            {
                sender: 0,
                content: 'Chào nha',
                time: '11: 00AM',
            },
        ],
    },
    {
        id: 2,
        name: 'Tran Thi B',
        avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
        pin: true,
        note: true,
        kind: 'priority',
        messages: [
            {
                sender: 2,
                content: 'Chào bạn',
                time: '10:00 AM',
            },
            {
                sender: 0,
                content: 'Hôm nay bạn thế nào?',
                time: '11:15 AM',
            },
        ],
    },
    {
        id: 3,
        name: 'Le Van C',
        avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
        pin: true,
        note: true,
        kind: 'other',
        messages: [
            {
                sender: 3,
                content: 'Chào bạn',
                time: '10:00 AM',
            },
            {
                sender: 0,
                content: 'Hẹn gặp bạn sau!',
                time: '11: 00AM',
            },
        ],
    },
];

export { data };
