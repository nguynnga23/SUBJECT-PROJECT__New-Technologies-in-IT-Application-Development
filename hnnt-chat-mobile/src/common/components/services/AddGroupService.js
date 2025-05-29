import axios from 'axios';
import { Alert, Platform } from 'react-native';
import { getCurrentTimeString } from '../../../utils/dateNow';
import { socket } from '../../../configs/socket';
import * as FileSystem from 'expo-file-system';
import { localhost } from '../../../utils/localhosts';

const API_URL = `${localhost}/api`;

// Hàm tạo nhóm
export const createGroup = async (name, avatar, chatParticipants, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/groups/create`,
            {
                name,
                avatar,
                chatParticipant: chatParticipants, // Danh sách thành viên
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            },
        );
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.warn('Error creating group:', error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const getListFriends = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/friends/list`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching friends:', error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const uploadFileToS3 = async (file, token) => {
    if (!file) throw new Error('File is required');
    if (!token) throw new Error('Token is required');

    try {
        const formData = new FormData();
        formData.append('file', {
            uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
            name: file.name,
            type: file.type,
        });

        const response = await axios.post(`${API_URL}/groups/upload`, formData, {
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

export async function prepare_uploadImg_createGroup(name, fileAsset, participants, token) {
    try {
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

        await createGroup(name, uploadUrl, participants, token);

        // socket.emit('createGroup', {
        //     name,
        //     avatar: uploadUrl,
        //     chatParticipant: chatParticipants,
        // });
        // Alert.alert('Success', 'Avatar upload successfully!');
    } catch (error) {
        console.error('Error preparing file:', error);
        Alert.alert('Error', 'Failed to preparing file.');
    }
}
