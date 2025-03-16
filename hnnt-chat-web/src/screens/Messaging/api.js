const API_CHAT_URL = 'http://localhost:4000/api/chats';
const API_MESSAGE_URL = 'http://localhost:4000/api/messages';

export const getChat = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(API_CHAT_URL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu');
    }

    return response.json();
};
