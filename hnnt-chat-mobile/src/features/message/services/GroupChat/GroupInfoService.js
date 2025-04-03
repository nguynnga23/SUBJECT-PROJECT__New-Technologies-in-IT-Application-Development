import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import axios from 'axios';
import { IP_4G, IP_WIFI } from '../../../../utils/localhosts'

const API_URL = `http://${IP_WIFI}:5000/api`;

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

export const getPinMess = async (chatId, token) => {
    try {
        const response = await axios.get(`${API_URL}/groups/message/${chatId}/show-pin`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

export const unPinMess = async (messageId, token) => {
    try {
        const response = await axios.put(`${API_URL}/groups/message/${messageId}/un-pin`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

export const editGroupName = async (e_name, chatId, token) => {
    try {
        const response = await axios.put(`${API_URL}/groups/${chatId}/edit-name`,
            { "name": e_name },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

export const handleReport = (reportReason, setReportVisible) => {
    if (!reportReason) return;
    console.log("Report reason:", reportReason);
    setReportVisible(false);
};

export const leaveGroup = async (chatId, token) => {
    try {
        const groupId = chatId;
        const response = await axios.delete(
            `${API_URL}/groups/${groupId}/leave`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            }
        );
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};

export const toggleMute = async (chatId, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/groups/mute`,
            { chatId }, // Body request
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            }
        );
        console.log('Response from toggleMute:', response.data); // Log thông tin từ response
        return response.data;
    } catch (error) {
        console.error('Error toggling mute:', error.response?.data || error.message);
        throw error;
    }
};

export const handleChangeAvatar = async (setAvatar) => {
    console.log("📸 Bắt đầu xử lý đổi avatar...");

    // Kiểm tra quyền truy cập ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("📜 Quyền truy cập:", status);

    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos.');
        return;
    }

    // Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    console.log("📷 Kết quả chọn ảnh:", result);

    if (!result.canceled) {
        console.log("✅ Ảnh được chọn:", result.assets[0].uri);
        setAvatar(result.assets[0].uri);
    }
};

export const disbandGroup = async (chatId, token) => {
    try {
        const groupId = chatId;
        const response = await axios.delete(
            `${API_URL}/groups/${groupId}/disband`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            }
        );
        return response.data;
    } catch (error) {
        console.warn('Error fetching:', error.response?.data || error.message);
        throw error;
    }
};