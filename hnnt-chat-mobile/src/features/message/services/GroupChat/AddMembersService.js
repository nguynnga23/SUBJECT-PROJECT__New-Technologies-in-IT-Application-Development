import axios from "axios";
import { localhost } from '../../../../utils/localhosts'

const API_URL = `${localhost}/api`;

export const getListFriend = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/friends/list`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.warn('Error fetching friends:', error.response?.data || error.message);
    }
}

export const addMember2Group = async (chatId, accId, token) => {
    try {
        const response = await axios.post(`${API_URL}/groups/${chatId}/add`,
            [
                {
                    accountId: accId, // Gửi accountId trong mảng
                },
            ],
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
        return response.data;
    } catch (error) {
        console.warn('Error add:', error.response?.data || error.message);
    }
}

export const fetchChat = async (chatId, token) => {
    try {
        const response = await axios.get(`${API_URL}/chats/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chat info:', error.response?.data || error.message);
        throw error;
    }
};