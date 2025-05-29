import axios from 'axios';
import { localhost } from '../../../utils/localhosts';
const API_BASE_URL = `${localhost}/api`; // Replace with your server's base URL

const ContactService = {
    async getListGroupChats(token) {
        try {
            const response = await axios.get(`${API_BASE_URL}/contacts/list-group-chats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching group chats:', error);
            throw error;
        }
    },

    async getChatByFriendId(friendId, token) {
        try {
            const response = await axios.get(`${API_BASE_URL}/contacts/chat/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching chat by friend ID:', error);
            throw error;
        }
    },
};

export default ContactService;
