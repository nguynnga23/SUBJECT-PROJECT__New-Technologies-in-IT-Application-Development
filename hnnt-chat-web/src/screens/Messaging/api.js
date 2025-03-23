export const getChat = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:4000/api/chats', {
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
    const token = localStorage.getItem('token');

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

export const sendMessage = async (chatId, content, type, replyToId, fileName, fileType, fileSize) => {
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
            body: JSON.stringify({ content, type, replyToId, fileName, fileType, fileSize }),
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

export const deleteMessage = async (messageId) => {
    if (!messageId) throw new Error('messageId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const response = await fetch(`http://localhost:4000/api/messages/${messageId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi xóa tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const destroyMessage = async (messageId) => {
    if (!messageId) throw new Error('messageId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const response = await fetch(`http://localhost:4000/api/messages/${messageId}/destroy`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi thu hồi tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const reactionMessage = async (messageId, userId, reaction) => {
    if (!messageId) throw new Error('messageId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/messages/${messageId}/reaction`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, reaction }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi thu hồi tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const removeReactionMessage = async (messageId, userId, reaction) => {
    if (!messageId) throw new Error('messageId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/messages/${messageId}/reaction`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, reaction }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi thu hồi tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};
