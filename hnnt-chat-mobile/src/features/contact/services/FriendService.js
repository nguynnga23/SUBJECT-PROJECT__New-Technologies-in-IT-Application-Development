import axios from 'axios';

const BASE_URL = 'http://172.20.61.183:4000/api'; // Thay bằng IP của server

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

    getFriendRequests: async () => {
        try {
            // Lấy user từ AsyncStorage
            const userJson = await AsyncStorage.getItem('user');
            if (!userJson) throw new Error('User not found in storage');

            const user = JSON.parse(userJson);
            const userId = user.id; // Hoặc user._id tùy theo backend

            // Gọi API với userId
            const response = await axios.get(`${API_URL}/request/${userId}`, {
                headers: getAuthHeader(),
            });

            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách lời mời kết bạn:', error);
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
