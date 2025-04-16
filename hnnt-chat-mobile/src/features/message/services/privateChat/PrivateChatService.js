import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { getUserIdFromToken } from "../../../../utils/auth";
import axios from 'axios';
import { localhost } from '../../../../utils/localhosts'
import { socket } from '../../../../configs/socket';

const API_URL = `http://${localhost}/api`;

let recording = null;

//Hiển thị menu khi nhấn giữ tin nhắn
export function handleLongPressMessage(messageId, messages, setMessages, chatId, token) {
    const message = messages.find((msg) => msg.id === messageId);

    if (!message) return;

    let options = [];

    if (message.destroy) {
        // Nếu tin nhắn bị thu hồi, chỉ hiển thị tùy chọn "Delete"
        options.push({
            text: "🗑️ Delete",
            onPress: async () => {
                try {
                    if (!messageId || !token) {
                        console.warn("Invalid messageId or token:", { messageId, token });
                        return;
                    }
                    const response = await deleteMessage(messageId, token);
                    socket.emit('del_message', {
                        chatId: chatId,
                    });
                    Alert.alert("Success", response.message);
                } catch (error) {
                    console.warn("Error deleting message:", error);
                    Alert.alert("Error", "Failed to delete the message.");
                }
            },
        });
    } else {
        // Nếu tin nhắn chưa bị thu hồi, hiển thị các tùy chọn khác
        options = [
            {
                text: "📌 Pin",
                onPress: async () => {
                    try {
                        if (!messageId || !token) {
                            console.error("Invalid messageId or token:", { messageId, token });
                            return;
                        }
                        await pinMessage(messageId, token);
                        Alert.alert("Success", "Pinned!");
                    } catch (error) {
                        console.warn("Error pinning message:", error);
                        Alert.alert("Error", "Failed to pin the message.");
                    }
                },
            },
            {
                text: "🗑️ Delete",
                onPress: async () => {
                    try {
                        if (!messageId || !token) {
                            console.warn("Invalid messageId or token:", { messageId, token });
                            return;
                        }
                        const response = await deleteMessage(messageId, token);
                        socket.emit('del_message', {
                            chatId: chatId,
                        });
                        Alert.alert("Success", response.message);
                    } catch (error) {
                        console.warn("Error deleting message:", error);
                        Alert.alert("Error", "Failed to delete the message.");
                    }
                },
            },
        ];

        if (message.sender.id === getUserIdFromToken(token)) {
            options.splice(2, 0, {
                text: "Recall",
                onPress: async () => {
                    try {
                        if (!messageId || !token) {
                            console.warn("Invalid messageId or token:", { messageId, token });
                            return;
                        }
                        const response = await destroyMessage(messageId, token);
                        socket.emit('del_message', {
                            chatId: chatId,
                        });
                        Alert.alert("Success", "Recall message success!");
                    } catch (error) {
                        console.warn("Error recalling message:", error);
                        Alert.alert("Error", "Failed to recall the message.");
                    }
                },
            });
        }
    }

    Alert.alert("Select an action", "What do you want to do with this message?", options, { cancelable: true });
}

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

const pinMessage = async (messageId, token) => {
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

const deleteMessage = async (messageId, token) => {
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

const destroyMessage = async (messageId, token) => {
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
export async function sendImage(messages, setMessages) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
        alert("Permission to access media library is required!");
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
    });

    if (!result.canceled) {
        const newMessage = {
            id: Date.now(),
            sender: "@nhietpham",
            name: "Nhiệt Phạm",
            image: result.assets[0].uri, // Lưu đường dẫn ảnh
            time: new Date().toLocaleTimeString().slice(0, 5),
            isMe: true,
        };
        setMessages([...messages, newMessage]);
    }
}

//Gửi tài liệu
export async function sendFile(messages, setMessages) {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: "*/*", // Cho phép tất cả loại file
        });

        if (result.canceled || !result.assets) return;

        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;
        const fileSize = result.assets[0].size;

        const newMessage = {
            id: Date.now(),
            sender: "@nhietpham",
            name: "Nhiệt Phạm",
            message: "📄 File: " + fileName,
            fileUri,
            fileName,
            fileSize,
            time: new Date().toLocaleTimeString().slice(0, 5),
            isMe: true,
        };

        setMessages([...messages, newMessage]);
    } catch (error) {
        console.error("Lỗi khi gửi file:", error);
    }
}

export async function downloadFile(fileUri, fileName) {
    try {
        if (fileUri.startsWith("file://")) {
            Alert.alert("Warning", "Device already had this file.");
            return;
        }

        const fileDest = FileSystem.documentDirectory + fileName;
        const downloadResumable = FileSystem.createDownloadResumable(
            fileUri,
            fileDest,
            {},
            (downloadProgress) => {
                const progress =
                    downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                console.log(`Tải xuống: ${Math.round(progress * 100)}%`);
            }
        );

        const { uri } = await downloadResumable.downloadAsync();
        Alert.alert("Download complete", `File is saved at: ${uri}`);
    } catch (error) {
        console.error("Lỗi khi tải file:", error);
        Alert.alert("Error", "Can't down file.");
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