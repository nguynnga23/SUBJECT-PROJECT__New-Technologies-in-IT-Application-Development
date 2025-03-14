import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

let recording = null;

//Hiển thị menu khi nhấn giữ tin nhắn
export function handleLongPressMessage(messageId, messages, setMessages, setReplyingMessage, setModalVisible) {
    const message = messages.find((msg) => msg.id === messageId);

    if (!message) return;

    let options = [
        { text: "📌 Pin", onPress: () => pinMessage(messageId) },
    ];

    if (message.isMe) {
        options.splice(1, 0, { text: "🗑️ Delete", onPress: () => handleDeleteMessage(messageId, messages, setMessages) });
    }

    Alert.alert("Select an action", "What do you want to do with this message?", options, { cancelable: true });
}

function pinMessage(messageId) {
    console.log("Ghim tin nhắn ID:", messageId);
}

export function handleDeleteMessage(messageId, messages, setMessages) {
    setMessages(messages.filter(msg => msg.id !== messageId));  // Cập nhật state
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