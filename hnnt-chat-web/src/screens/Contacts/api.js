export const getListFriendByKeyword = async (keyword) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const response = await fetch(`http://localhost:4000/api/friends/list/search/?keyword=${keyword}`, {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getListFriend = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch('http://localhost:4000/api/friends/list', {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getListFriendRequest = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch('http://localhost:4000/api/friends/request/sender/', {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getListFriendReponse = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch('http://localhost:4000/api/friends/request', {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getListGroupChatByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch('http://localhost:4000/api/contacts/list-group-chats', {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const acceptFriendReponse = async (requestId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/friends/request/accept/${requestId}`, {
            method: 'POST',
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const refuseFriendReponse = async (requestId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/friends/request/cancel/${requestId}`, {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const deleteFriend = async (friendId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/friends/delete/${friendId}`, {
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
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};
