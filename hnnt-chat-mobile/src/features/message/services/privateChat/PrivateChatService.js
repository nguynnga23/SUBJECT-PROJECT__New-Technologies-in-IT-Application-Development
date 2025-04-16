import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import { getUserIdFromToken } from "../../../../utils/auth";
import { getCurrentTimeString } from "../../../../utils/dateNow";
import axios from 'axios';
import { localhost } from '../../../../utils/localhosts'
import { socket } from '../../../../configs/socket';

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
        const response = await axios.put(`${API_URL}/groups/message/${messageId}/pin`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteMessage = async (messageId, token) => {
    if (!token) {
        console.error("Token is missing!");
        throw new Error("Token is required to delete the message.");
    }
    try {
        const response = await axios.put(`${API_URL}/messages/${messageId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Đảm bảo định dạng đúng
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error.response?.data || error.message);
        throw error;
    }
};

export const destroyMessage = async (messageId, token) => {
    if (!token) {
        console.error("Token is missing!");
        throw new Error("Token is required to delete the message.");
    }
    try {
        const response = await axios.put(`${API_URL}/messages/${messageId}/destroy`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Đảm bảo định dạng đúng
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error.response?.data || error.message);
        throw error;
    }
};

//Gửi tin nhắn
export const sendMessage = async (chatId, content, type, replyToId, fileName, fileType, fileSize, token) => {
    if (!content.trim()) throw new Error("Content is empty");
    if (!chatId) throw new Error("Chat ID is required");
    if (!token) throw new Error("Token is required");
    try {
        // const formData = new FormData();
        //     formData.append('image', {
        //         fileName
        //     });
        const response = await axios.post(`${API_URL}/messages/${chatId}`, {
            content, type, replyToId, fileName, fileType, fileSize
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        throw error;
    }
};

//Gửi ảnh
export async function prepareImage(chatId, token) {
    try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Alert.alert("Permission Denied", "Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log("Image selection canceled.");
            return;
        }

        const image = result.assets[0];
        const fileUri = image.uri;
        const originalName = fileUri.split('/').pop() || "image.jpg";

        // Lấy phần mở rộng file (jpg, png,...)
        const extension = originalName.includes('.') ? originalName.split('.').pop() : 'jpg';

        // Tạo tên file mới có chứa giờ hiện tại
        const timeStamp = getCurrentTimeString();
        // const fileName = `image_${timeStamp}.${extension}`;

        const fileType = image.type || "image/jpeg";
        const fileSize = image.fileSize || 0;
        const fileSize_String = fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : "Unknown size";
        await sendMessage(chatId, 'sent image', 'image', null, fileUri, fileType, fileSize_String, token);

        socket.emit('del_message', { chatId });

        Alert.alert("Success", "Image sent successfully!");
    } catch (error) {
        console.error("Error preparing image:", error);
        Alert.alert("Error", "Failed to send the image.");
    }
}

//Gửi tài liệu
export async function prepareFile(chatId, token) {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: "*/*"
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log("File selection canceled.");
            return;
        }

        const file = result.assets ? result.assets[0] : result;
        const fileUri = file.uri;
        const originalName = file.name || "file";
        const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
        const timeStamp = getCurrentTimeString();
        const fileName = `${originalName.replace(`.${extension}`, '')}_${timeStamp}.${extension}`;
        const fileType = file.mimeType || "application/octet-stream";
        const fileSize = file.size || 0;
        const fileSizeString = fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : "Unknown size";

        await sendMessage(chatId, fileName, 'file', null, fileUri, fileType, fileSizeString, token);

        socket.emit('del_message', { chatId });

        Alert.alert("Success", "File sent successfully!");
    } catch (error) {
        console.error("Error preparing file:", error);
        Alert.alert("Error", "Failed to send the file.");
    }
}

// Bắt đầu ghi âm
export async function startRecording(setRecording) {
    try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
            Alert.alert("Permission denied", "Please allow microphone access.");
            return;
        }

        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

        recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();

        setRecording(true);
        console.log("Bắt đầu ghi âm...");
    } catch (error) {
        console.error("Lỗi khi ghi âm:", error);
    }
}

// Dừng ghi âm
export async function stopRecording(setRecording, setRecordingUri, setRecordingSaved) {
    try {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Tệp ghi âm đã lưu tại:", uri);

        setRecording(false);
        setRecordingUri(uri);
        setRecordingSaved(true);  // Cập nhật trạng thái đã lưu
        Alert.alert("Recording is saved", "Saving recording suscessful.");

        recording = null;
    } catch (error) {
        console.error("Lỗi khi dừng ghi âm:", error);
    }
}

// Gửi tin nhắn âm thanh
export async function sendVoiceMessage(recordingUri, setRecording, setRecordingUri, setRecordingSaved, messages, setMessages) {
    if (!recordingUri) {
        Alert.alert("No recording file available", "Please press start and stop then before sending.");
        return;
    }

    if (recording) {
        await stopRecording(setRecording, setRecordingUri, setRecordingSaved);
    }

    const newMessage = {
        id: Date.now(),
        sender: "@nhietpham",
        name: "Nhiệt Phạm",
        message: "🎤 Voice message",
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
        console.error("Lỗi khi phát âm thanh:", error);
    }
}

//reaction
export const sendReaction = async (messageId, userId, reaction, token) => {
    try {
        const response = await axios.put(`${API_URL}/messages/${messageId}/reaction`, {
            userId,
            reaction,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant storage permissions to download the image.');
            return;
        }

        // Tạo tên file an toàn
        let fileName = imageUrl.split('/').pop();
        if (!fileName || !fileName.includes('.')) {
            fileName = `image_${Date.now()}.jpg`; // fallback tên và định dạng
        }

        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        const downloadResumable = FileSystem.createDownloadResumable(imageUrl, fileUri);

        const { uri } = await downloadResumable.downloadAsync();
        console.log('Download finished. File saved to:', uri);

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false);

        Alert.alert('Download Complete', 'The image has been saved to your gallery.');
    } catch (error) {
        console.error('Error downloading image:', error);
        Alert.alert('Error', 'Failed to download the image.');
    }
};

export const downloadAnyFile = async (fileUrl) => {
    try {
        console.log('Downloading file from URL:', fileUrl);

        // Xin quyền truy cập media
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Bạn cần cấp quyền lưu trữ để tải file.');
            return;
        }

        // Tạo tên file an toàn
        let fileName = fileUrl.split('?')[0].split('/').pop(); // loại bỏ query string
        if (!fileName || !fileName.includes('.')) {
            // fallback nếu không có đuôi
            const extension = '.bin';
            fileName = `file_${Date.now()}${extension}`;
        }

        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        // Tạo tiến trình tải
        const downloadResumable = FileSystem.createDownloadResumable(fileUrl, fileUri);
        const { uri } = await downloadResumable.downloadAsync();

        console.log('Tải xong, lưu file:', uri);

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false);

        Alert.alert('Tải thành công', `Đã lưu file: ${fileName}`);
    } catch (error) {
        console.error('Lỗi khi tải file:', error);
        Alert.alert('Lỗi', 'Không thể tải file.');
    }
};