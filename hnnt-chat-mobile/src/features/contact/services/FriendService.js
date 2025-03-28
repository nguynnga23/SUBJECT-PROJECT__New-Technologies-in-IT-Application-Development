import axios from 'axios';

const BASE_URL = 'http://localhost:4000'; // Thay bằng IP của server

const friendService = {
    // Lấy danh sách bạn bè của người đăng nhập
    getFriends: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/friends/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Block một người bạn
    blockFriend: async (receiverId, token) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/block`,
                { receiverId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Có thể thêm các hàm khác như gửi lời mời, chấp nhận lời mời, v.v.
    sendFriendRequest: async (receiverId, token) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/friend-request`,
                { receiverId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default friendService;
