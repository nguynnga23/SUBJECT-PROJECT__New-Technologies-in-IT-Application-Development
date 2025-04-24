import { Alert, Platform, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { getUserIdFromToken } from '../../../utils/auth';
import { getCurrentTimeString } from '../../../utils/dateNow';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { localhost } from '../../../utils/localhosts';
import { socket } from '../../../configs/socket';
const API_URL = `http://${localhost}/api`;

let recording = null;

export const fetchMessages = async (chatId, token) => {
    try {
        const response = await axios.get(`${API_URL}/messages/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data; // Trả về danh sách tin nhắn
    } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
        throw error;
    }
};

export const pinMessage = async (messageId, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/groups/message/${messageId}/pin`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteMessage = async (messageId, token) => {
    if (!token) {
        console.error('Token is missing!');
        throw new Error('Token is required to delete the message.');
    }
    try {
        const response = await axios.put(
            `${API_URL}/messages/${messageId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đảm bảo định dạng đúng
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error.response?.data || error.message);
        throw error;
    }
};

export const destroyMessage = async (messageId, token) => {
    if (!token) {
        console.error('Token is missing!');
        throw new Error('Token is required to delete the message.');
    }
    try {
        const response = await axios.put(
            `${API_URL}/messages/${messageId}/destroy`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đảm bảo định dạng đúng
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error.response?.data || error.message);
        throw error;
    }
};

//Gửi tin nhắn
export const sendMessage = async (chatId, content, type, replyToId, fileName, fileType, fileSize, token) => {
    if (!content.trim()) throw new Error('Content is empty');
    if (!chatId) throw new Error('Chat ID is required');
    if (!token) throw new Error('Token is required');
    try {
        const response = await axios.post(
            `${API_URL}/messages/${chatId}`,
            {
                content,
                type,
                replyToId,
                fileName,
                fileType,
                fileSize,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        throw error;
    }
};

export const getFileUri = async (uri) => {
    // Xử lý URI content:// trên Android
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
        const filename = `${Date.now()}.jpg`; // Có thể sửa tùy định dạng
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
        try {
            await FileSystem.copyAsync({
                from: uri,
                to: fileUri,
            });
            return fileUri;
        } catch (error) {
            console.error('Error converting content:// URI', error);
            throw error;
        }
    }

    // iOS hoặc Android đã là file:// thì trả lại nguyên xi
    return uri;
};

//upload file to s3
export const uploadFileToS3 = async (file, token) => {
    if (!file) throw new Error('File is required');
    if (!token) throw new Error('Token is required');

    try {
        const fixedUri = await getFileUri(file.uri);

        const formData = new FormData();
        formData.append('file', {
            uri: Platform.OS === 'ios' ? fixedUri.replace('file://', '') : fixedUri,
            name: file.name,
            type: file.type,
        });

        const response = await axios.post(`${API_URL}/messages/upload`, formData, {
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

//Gửi ảnh
export async function prepareImage(chatId, token, replyId) {
    try {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access camera is required!');
            return;
        }

        Alert.alert(
            'Choose an option',
            'Would you like to select from the gallery or use the camera?',
            [
                {
                    text: 'Gallery',
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.All,
                            allowsMultipleSelection: true,
                            allowsEditing: false,
                            quality: 1,
                        });

                        if (result.canceled || !result.assets || result.assets.length === 0) {
                            console.log('Selection canceled.');
                            return;
                        }

                        for (const asset of result.assets) {
                            const fileUri = asset.uri;
                            const originalName = fileUri.split('/').pop() || 'file';
                            const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
                            const timeStamp = getCurrentTimeString();
                            const fileName = `${originalName.replace(`.${extension}`, '')}_${timeStamp}.${extension}`;
                            const fileType = asset.type || (extension === 'mp4' ? 'video/mp4' : 'image/jpeg');
                            // Lấy kích thước tệp bằng expo-file-system
                            let fileSize = 0;
                            try {
                                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                                fileSize = fileInfo.size; // Kích thước tệp (bytes)
                            } catch (error) {
                                console.warn('Error getting file size:', error);
                            }
                            console.log('File size:', fileSize);
                            // Kiểm tra kích thước tệp (giới hạn 10MB)
                            if (fileSize === 0 || fileSize >= 10 * 1024 * 1024) {
                                Alert.alert('File too large', 'Please select a file smaller than 10MB.');
                                return;
                            }

                            const fileSizeString = fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : 'Unknown size';

                            const file = {
                                uri: fileUri,
                                name: fileName,
                                type: fileType,
                            };

                            const uploadResponse = await uploadFileToS3(file, token);
                            const uploadUrl = uploadResponse?.fileUrl || uploadResponse?.url || null;

                            if (!uploadUrl) {
                                Alert.alert('Upload Failed', 'No URL returned from server.');
                                return;
                            }
                            const messageType = fileType.startsWith('video') ? 'file' : 'image';
                            await sendMessage(
                                chatId,
                                uploadUrl,
                                messageType,
                                replyId || null,
                                fileName,
                                fileType,
                                fileSizeString,
                                token,
                            );
                        }

                        socket.emit('del_message', { chatId });
                        Alert.alert('Success', 'Files sent successfully!');
                    },
                },
                {
                    text: 'Camera',
                    onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.All,
                            allowsEditing: false,
                            quality: 1,
                        });

                        if (result.canceled) {
                            console.log('Camera action canceled.');
                            Alert.alert('Action Canceled', 'You canceled the camera action.');
                            return;
                        }

                        if (!result.assets || result.assets.length === 0) {
                            console.log('No image captured.');
                            Alert.alert('Error', 'No image was captured.');
                            return;
                        }

                        const fileUri = result.assets[0].uri;
                        const originalName = fileUri.split('/').pop() || 'file';
                        const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
                        const timeStamp = getCurrentTimeString();
                        const fileName = `${originalName.replace(`.${extension}`, '')}_${timeStamp}.${extension}`;
                        const fileType = result.assets[0].type || (extension === 'mp4' ? 'video/mp4' : 'image/jpeg');
                        const fileSize = result.assets[0].fileSize || 0;
                        const fileSizeString = fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : 'Unknown size';

                        const file = {
                            uri: fileUri,
                            name: fileName,
                            type: fileType,
                        };

                        const uploadResponse = await uploadFileToS3(file, token);
                        const uploadUrl = uploadResponse?.fileUrl || uploadResponse?.url || null;

                        if (!uploadUrl) {
                            Alert.alert('Upload Failed', 'No URL returned from server.');
                            return;
                        }
                        const messageType = fileType.startsWith('video') ? 'file' : 'image';

                        await sendMessage(
                            chatId,
                            uploadUrl,
                            messageType,
                            replyId || null,
                            fileName,
                            fileType,
                            fileSizeString,
                            token,
                        );

                        socket.emit('del_message', { chatId });
                        Alert.alert('Success', 'Media sent successfully!');
                    },
                },
            ],
            { cancelable: true },
        );
    } catch (error) {
        console.error('Error preparing files:', error);
        Alert.alert('Error', 'Failed to send the files.');
    }
}

//Gửi tài liệu
export async function prepareFile(chatId, token, replyId) {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: '*/*',
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log('File selection canceled.');
            return;
        }

        const fileAsset = result.assets[0];
        const uri = fileAsset.uri;
        const originalName = fileAsset.name || uri.split('/').pop() || `file_${Date.now()}`;
        const extension = originalName.split('.').pop() || '';
        const timeStamp = getCurrentTimeString();
        const fileName = `file_${timeStamp}.${extension}`;
        const fileType = fileAsset.mimeType || 'application/octet-stream';
        const fileSize = fileAsset.size || 0;
        // Kiểm tra kích thước tệp có lớn hơn 10MB hay không
        if (!fileSize || fileSize === 0 || fileSize >= 10 * 1024 * 1024) {
            Alert.alert('File too large', 'Please select a file smaller than 10MB.');
            return;
        }

        const fileSize_String = fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : 'Unknown size';

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

        await sendMessage(chatId, uploadUrl, 'file', replyId || null, fileName, fileType, fileSize_String, token);

        socket.emit('del_message', { chatId });

        Alert.alert('Success', 'File sent successfully!');
    } catch (error) {
        console.error('Error preparing file:', error);
        Alert.alert('Error', 'Failed to send the file.');
    }
}

// Bắt đầu ghi âm
export async function startRecording(setRecording) {
    try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
            Alert.alert('Permission denied', 'Please allow microphone access.');
            return;
        }

        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

        recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();

        setRecording(true);
        console.log('Bắt đầu ghi âm...');
    } catch (error) {
        console.error('Lỗi khi ghi âm:', error);
    }
}

// Dừng ghi âm
export async function stopRecording(setRecording, setRecordingUri, setRecordingSaved) {
    try {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Tệp ghi âm đã lưu tại:', uri);

        setRecording(false);
        setRecordingUri(uri);
        setRecordingSaved(true); // Cập nhật trạng thái đã lưu
        Alert.alert('Recording is saved', 'Saving recording suscessful.');

        recording = null;
    } catch (error) {
        console.error('Lỗi khi dừng ghi âm:', error);
    }
}

// Gửi tin nhắn âm thanh
export async function sendVoiceMessage(
    recordingUri,
    setRecording,
    setRecordingUri,
    setRecordingSaved,
    messages,
    setMessages,
) {
    if (!recordingUri) {
        Alert.alert('No recording file available', 'Please press start and stop then before sending.');
        return;
    }

    if (recording) {
        await stopRecording(setRecording, setRecordingUri, setRecordingSaved);
    }

    const newMessage = {
        id: Date.now(),
        sender: '@nhietpham',
        name: 'Nhiệt Phạm',
        message: '🎤 Voice message',
        time: new Date().toLocaleTimeString().slice(0, 5),
        isMe: true,
        audioUri: recordingUri,
    };

    setMessages([...messages, newMessage]);
    setRecordingUri(null);
    setRecordingSaved(false); // Reset trạng thái sau khi gửi
}

// Phát lại tin nhắn âm thanh
export async function playAudio(uri) {
    try {
        const { sound } = await Audio.Sound.createAsync({ uri });
        await sound.playAsync();
    } catch (error) {
        console.error('Lỗi khi phát âm thanh:', error);
    }
}

//Reaction
export const sendReaction = async (messageId, userId, reaction, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/messages/${messageId}/reaction`,
            {
                userId,
                reaction,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error sending reaction:', error.response?.data || error.message);
        throw error;
    }
};

//remove reaction
export const removeReaction = async (messageId, userId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/messages/${messageId}/reaction`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                userId,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error removing reaction:', error.response?.data || error.message);
        throw error;
    }
};

export const downloadImage = async (imageUrl) => {
    try {
        // 1. Yêu cầu quyền truy cập thư viện
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant storage permissions to download the image.');
            return;
        }

        // 2. Tạo tên file an toàn
        let fileName = imageUrl.split('/').pop()?.split('?')[0];
        if (!fileName || !fileName.includes('.')) {
            fileName = `image_${Date.now()}.jpg`; // fallback tên và định dạng
        }

        const fileUri = FileSystem.documentDirectory + fileName;

        // 3. Tải file
        const downloadResumable = FileSystem.createDownloadResumable(imageUrl, fileUri);

        const { uri } = await downloadResumable.downloadAsync();
        console.log('✅ Download finished. File saved to:', uri);

        // 4. Lưu vào thư viện
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false); // album `Download`

        Alert.alert('✅ Download Complete', 'The image has been saved to your gallery.');
    } catch (error) {
        console.error('❌ Error downloading image:', error);

        if (error.message?.includes('Network')) {
            Alert.alert('Network Error', 'Please check your internet connection.');
        } else if (error.message?.includes('MEDIA_LIBRARY')) {
            Alert.alert('Permission Error', 'Media Library permission is required.');
        } else {
            Alert.alert('Error', 'Failed to download the image.');
        }
    }
};

import * as Sharing from 'expo-sharing';

export const ShareAnyFile = async (fileUrl) => {
    try {
        const fileName = fileUrl.split('/').pop()?.split('?')[0] || `file_${Date.now()}`;
        const downloadUri = `${FileSystem.documentDirectory}${fileName}`;

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'You need to grant storage permission.');
            return;
        }

        const downloadRes = await FileSystem.downloadAsync(fileUrl, downloadUri);

        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Not supported', 'Sharing is not available on this device');
            return;
        }

        await Sharing.shareAsync(downloadRes.uri);
    } catch (error) {
        console.error('Error downloading file:', error);
        Alert.alert('Error', 'Failed to share file.');
    }
};

export const downloadAnyFile = async (fileUrl) => {
    try {
        // Tạo link tới server trung gian (đã cấu hình Content-Disposition: attachment)
        const encodedUrl = encodeURIComponent(fileUrl);
        const fileName = fileUrl.split('/').pop()?.split('?')[0] || `file_${Date.now()}`;
        const serverDownloadUrl = `${API_URL}/public-download/?url=${encodedUrl}&name=${fileName}`;

        await Linking.openURL(serverDownloadUrl);
    } catch (error) {
        console.error('Error open browser to download file:', error);
        Alert.alert('Error', 'Error open browser to download file.');
    }
};

//Preview file
export const previewFile = async (fileUrl) => {
    try {
        await Linking.openURL(fileUrl);
    } catch (error) {
        console.error('Error open browser to preview file:', error);
        Alert.alert('Error', 'Error open browser to preview file.');
    }
};

// Lấy danh sách bạn bè đã chặn
export const getBlockedUsers = async (userId, token) => {
    try {
        const response = await axios.get(`${API_URL}/friends/user/block/list/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching blocked users:', error.response?.data || error.message);
        throw error;
    }
};
