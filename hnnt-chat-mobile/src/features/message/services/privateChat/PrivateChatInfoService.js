import { Alert } from 'react-native';
import axios from 'axios';
import { localhost } from '../../../../utils/localhosts'
import { socket } from '../../../../configs/socket';

const API_URL = `${localhost}/api`;

export const fetchChat = async (chatId, token) => {
    try {
        const response = await axios.get(`${API_URL}/chats/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.warn('Error fetching chat info:', error.response?.data || error.message);
        throw error;
    }
};

export const getPinMess = async (chatId, token) => {
    try {
        const response = await axios.get(`${API_URL}/groups/message/${chatId}/show-pin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        // console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

export const unPinMess = async (messageId, token) => {
    try {
        const response = await axios.put(`${API_URL}/groups/message/${messageId}/un-pin`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

//const { chatId } = req.params;
export const deleteAllMessage = async (chatId, token) => {
    try {
        const response = await axios.put(`${API_URL}/chats/${chatId}/all-delete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
}

export const blockUser = async (senderId, receiverId, token) => {
    try {
        const response = await axios.post(`${API_URL}/friends/user/block`,
            {
                senderId,
                receiverId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
}

export const handleReport = (reportReason, setReportVisible) => {
    if (!reportReason) return;
    console.log("Report reason:", reportReason);
    setReportVisible(false);
};

export const handleBlock = (setBlockVisible, navigation) => {
    console.log("Block user");
    setBlockVisible(false);
    navigation.reset({
        index: 0,
        routes: [{ name: "MessageScreen" }],
    });
};

export const toggleMute = async (chatId, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/groups/mute`,
            { chatId }, // Body request
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

export const searchMessage = async (chatId, token, keyword) => {
    try {
        const response = await axios.get(
            `${API_URL}/messages/search/${chatId}/?keyword=${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};