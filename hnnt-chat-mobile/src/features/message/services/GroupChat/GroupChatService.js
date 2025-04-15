import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from 'axios';
import { getUserIdFromToken } from "../../../../utils/auth";
import { localhost } from '../../../../utils/localhosts'

const API_URL = `http://${localhost}/api`;

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

let recording = null;
let chatData = {
    group_name: "CNMOI-HK2-24-25",
    members: [
        { id: 1, name: "Nga Nguyễn", username: "@nganguyen92", avatar: "avatar1.png" },
        { id: 2, name: "Huy Nguyễn", username: "@huynh503", avatar: "avatar2.png" },
        { id: 3, name: "Nhiệt Phạm", username: "@nhietpham", avatar: "avatar3.png", isMe: true },
        { id: 4, name: "nguyenthientu413", username: "@nguyenthientu413", avatar: "avatar4.png" },
    ],
    messages: [
        { id: "101", sender: "@nganguyen92", name: "Nga Nguyễn", message: "Trello có đủ tài liệu nha!", time: "18:55" },
        { id: "102", sender: "@nganguyen92", name: "Nga Nguyễn", message: "Mn nhớ update task trên Trello nhé!", time: "18:56" },
        { id: "103", sender: "@huynh503", name: "Huy Nguyễn", message: "ok", time: "18:57" },
        { id: "104", sender: "@nhietpham", name: "Nhiệt Phạm", message: "yup", time: "19:00", isMe: true },
        { id: "105", sender: "@nguyenthientu413", name: "Tứ Nguyễn", message: "got it", time: "19:05" },
    ],
    reaction: [
        { id: "1", reaction: "❤️", messageId: 101, userId: "@nganguyen92", sum: 1 },
        { id: "2", reaction: "😂", messageId: 104, userId: "@nhietpham", sum: 1 },
        { id: "3", reaction: "😂", messageId: 101, userId: "@nhietpham", sum: 2 },
    ]
};

//Hiển thị menu khi nhấn giữ tin nhắn
export function handleLongPressMessage(messageId, messages, setMessages, setReplyingMessage, setModalVisible, token) {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    let options = [
        {
            text: "📌 Pin", onPress: async () => {
                try {
                    const response = await pinMessage(messageId, token); // Gọi API pinMessage
                    Alert.alert("Success", response.message); // Hiển thị thông báo từ API
                } catch (error) {
                    console.error("Error pinning message:", error);
                    Alert.alert("Error", "Failed to pin the message."); // Hiển thị lỗi nếu có
                }
            },
        },
        {
            text: "↩️ Answer",
            onPress: () => {
                setReplyingMessage(message);
                setModalVisible(true); // Chỉ bật modal khi chọn Answer
            }
        },
        {
            text: "🗑️ Delete", onPress: () => handleDeleteMessage(messageId, messages, setMessages),
        }
    ];

    if (message.sender.id === getUserIdFromToken(token)) {
        options.splice(1, 0, { text: "Recall", onPress: () => handleDeleteMessage(messageId, messages, setMessages) });
    }

    Alert.alert("Select an action", "What do you want to do with this message?", options, { cancelable: true });
}

//Ghim tin nhắn
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

//Xóa tin nhắn
export function handleDeleteMessage(messageId, messages, setMessages) {
    setMessages(messages.filter(msg => msg.id !== messageId));  // Cập nhật state
}

//Trả lời tin nhắn
function answerMessage(messageId, messages, setReplyingMessage) {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
        console.log("Trả lời tin nhắn:", message?.message);
        setReplyingMessage(message);
    }
}

//Gửi tin nhắn
export function handleSendMessage(text, messages, setMessages, replyingMessage, setReplyingMessage) {
    if (!text.trim()) return;
    const newMessage = {
        id: Date.now(),
        sender: "@nhietpham",
        name: "Nhiệt Phạm",
        message: text,
        time: new Date().toLocaleTimeString().slice(0, 5),
        isMe: true,
        replyTo: replyingMessage ? { name: replyingMessage.name, message: replyingMessage.message } : null,
    };
    setMessages([...messages, newMessage]);
    setReplyingMessage(null);
}

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
export function handleReaction(userId, emoji, messageId) {

}

export default chatData;
