const API_CHAT_URL = 'http://localhost:4000/api/chats';
const token = localStorage.getItem('token');

export const getChat = async () => {
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

export const getMessage = async (chatId) => {
    if (!chatId) throw new Error('chatId is required');

    const response = await fetch(`http://localhost:4000/api/messages/${chatId}`, {
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

export const sendMessage = async (chatId, content, type) => {
    if (!chatId) throw new Error('chatId is required');
    if (!content) throw new Error('Content is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const response = await fetch(`http://localhost:4000/api/messages/${chatId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, type }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};
