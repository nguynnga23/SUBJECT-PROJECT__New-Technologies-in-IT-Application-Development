export const getUserByNumberOrEmail = async (number) => {
    try {
        const response = await fetch(`http://localhost:4000/api/user/get-user-by-number-or-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error;
    }
};

export const searchByPhone = async (number) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/user/search-by-phone`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bạn bè', error);
        throw error;
    }
};

export const sendFriendRequest = async (receiverId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/friends/request`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ receiverId }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu kết bạn', error);
        throw error;
    }
};
