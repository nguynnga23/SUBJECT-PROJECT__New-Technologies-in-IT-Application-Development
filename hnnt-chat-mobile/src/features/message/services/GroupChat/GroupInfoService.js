import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import { localhost } from '../../../../utils/localhosts'
import { getCurrentTimeString } from '../../../../utils/dateNow';
import { socket } from '../../../../configs/socket';
import * as FileSystem from 'expo-file-system';

const API_URL = `${localhost}/api`;

const axiosInstance_30s = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 giây
});

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

export const editGroupName = async (n_name, chatId, token) => {
    try {
        const response = await axios.put(`${API_URL}/groups/${chatId}/edit-name`,
            { "name": n_name },
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

const editGroupAvatar = async (groupId, token, avatar) => {
    try {
        const response = await axios.put(`${API_URL}/groups/${groupId}/edit-avatar`,
            { avatar },
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

const uploadFileToS3 = async (file, token) => {
    if (!file) throw new Error('File is required');
    if (!token) throw new Error('Token is required');

    try {
        const formData = new FormData();
        formData.append('file', {
            uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
            name: file.name,
            type: file.type,
        });

        const response = await axiosInstance_30s.post(`${API_URL}/groups/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // BẮT BUỘC cho React Native
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error?.response?.data || error.message);
        throw error;
    }
};

export async function prepareImage(chatId, token) {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: false,
            allowsEditing: true,
            quality: 1,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log('Selection canceled.');
            return;
        }

        const fileAsset = result.assets[0];
        const uri = fileAsset.uri;
        const originalName = fileAsset.name || uri.split('/').pop() || `file_${Date.now()}`;
        const extension = originalName.split('.').pop() || '';
        const timeStamp = getCurrentTimeString();
        const fileName = `file_${timeStamp}.${extension}`;
        const fileType = fileAsset.mimeType || 'application/octet-stream';

        // Lấy kích thước tệp bằng expo-file-system
        let fileSize = 0;
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            fileSize = fileInfo.size; // Kích thước tệp (bytes)
        } catch (error) {
            console.warn('Error getting file size:', error);
        }
        console.log('File size:', fileSize);
        // Kiểm tra kích thước tệp (giới hạn 10MB)
        if (fileSize === 0 || fileSize > 10 * 1024 * 1024) {
            Alert.alert('File too large', 'Please select a file smaller than 10MB.');
            return;
        }

        const file = {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: fileName,
            type: fileType,
        };

        console.log('File to upload:', file);
        const uploadResponse = await uploadFileToS3(file, token);
        const uploadUrl = uploadResponse?.fileUrl || uploadResponse?.url || null;

        if (!uploadUrl) {
            Alert.alert('Upload Failed', 'No URL returned from server.');
            return;
        }

        await editGroupAvatar(chatId, token, uploadUrl);

        Alert.alert('Success', 'Avatar upload successfully!');
    } catch (error) {
        console.error('Error preparing file:', error);
        Alert.alert('Error', 'Failed to preparing file.');
    }
}

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