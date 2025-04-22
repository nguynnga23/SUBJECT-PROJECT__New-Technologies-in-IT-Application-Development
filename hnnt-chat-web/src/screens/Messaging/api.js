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

export const getChatById = async (chatId) => {
    if (!chatId) throw new Error('chatId is required');
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:4000/api/chats/${chatId}`, {
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
        console.error('Lỗi khi thả biểu cảm vào tin nhắn:', error);
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
        console.error('Lỗi khi xóa biểu cảm:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const pinChatOfUser = async (chatId) => {
    if (!chatId) throw new Error('chatId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/${chatId}/pin`, {
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
        console.error('Lỗi khi cập nhật ghim chat:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const priorityChatOfUser = async (chatId) => {
    if (!chatId) throw new Error('chatId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/${chatId}/priority`, {
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
        console.error('Lỗi khi cập nhật ghim chat:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const readedChatOfUser = async (chatId) => {
    if (!chatId) throw new Error('chatId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/${chatId}/readed`, {
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
        console.error('Lỗi khi cập nhật ghim chat:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};
export const readedAllChatOfUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/all-readed`, {
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
        console.error('Lỗi khi cập nhật ghim chat:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const deleteAllChatOfChat = async (chatId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/${chatId}/all-delete`, {
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
        console.error('Lỗi khi xóa tất cả tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};
export const notifyChatOfUser = async (chatId) => {
    if (!chatId) throw new Error('chatId is required');

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/${chatId}/notify`, {
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
        console.error('Lỗi khi cập nhật thông báo chat:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getAllCategory = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/categories`, {
            method: 'GET',
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
        console.error('Lỗi khi lấy danh sách category:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const addCategory = async (name, color) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/categories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, color }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách category:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const deleteCategory = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/categories/${id}`, {
            method: 'DELETE',
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
        console.error('Lỗi khi lấy danh sách category:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const addCategoryToChat = async (chatId, categoryId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/${chatId}/category`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách category:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const pinOfMessage = async (messageId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/messages/${messageId}/pin`, {
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
        console.error('Lỗi khi pin tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const deletePinOfMessage = async (messageId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/messages/${messageId}/pin/delete`, {
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
        console.error('Lỗi khi pin tin nhắn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const searchFollowKeyWord = async (keyword) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/messages/search/?keyword=${keyword}`, {
            method: 'GET',
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
        console.error('Lỗi khi search theo keyword:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const searchFollowKeyWordByChat = async (keyword, chatId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/messages/search/${chatId}/?keyword=${keyword}`, {
            method: 'GET',
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
        console.error('Lỗi khi search theo keyword:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getChatByUser = async (userId2) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/chats/user/${userId2}`, {
            method: 'GET',
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
        console.error('Lỗi khi search theo keyword:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const createGroupChat = async (name, avatar, chatParticipant) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/groups/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, avatar, chatParticipant }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi tạo group:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const addMemberToGroup = async (groupId, members) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/groups/${groupId}/add`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(members),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi thêm member group:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const uploadFileToS3 = async (file) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const formData = new FormData();
        formData.append('file', file); // tên 'file' phải giống với multer .single('file')

        const response = await fetch(`http://localhost:4000/api/messages/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                // KHÔNG set Content-Type nếu dùng FormData!
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi upload file:', error);
        throw error;
    }
};

export const uploadFileFormChatGroupToS3 = async (file) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const formData = new FormData();
        formData.append('file', file); // tên 'file' phải giống với multer .single('file')

        const response = await fetch(`http://localhost:4000/api/groups/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                // KHÔNG set Content-Type nếu dùng FormData!
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi upload file:', error);
        throw error;
    }
};
