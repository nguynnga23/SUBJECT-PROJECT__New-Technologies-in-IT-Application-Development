import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Header from '../../../../common/components/Header';
import { useRoute } from '@react-navigation/native';
import ChatInputContainer from '../../components/ChatInputContainer';

import {
    handleLongPressMessage,
    handleDeleteMessage,
    handleSendMessage,
    sendImage,
    sendFile,
    downloadFile,
    startRecording,
    stopRecording,
    sendVoiceMessage,
    playAudio,
    fetchMessages
} from '../../services/privateChat/PrivateChatService';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../utils/auth';
import { formatDateTime } from '../../../../utils/formatDateTime';

export default function PrivateChatScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId, chatName } = route.params;
    const [currentUserId, setCurrentUserId] = useState(null);
    const [token, setToken] = useState(null);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageId, setMessageId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalRecordVisible, setModalRecordVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState(null);
    const [recordingSaved, setRecordingSaved] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const reactionsList = ['❤️', '😂', '👍', '😮', '😢'];
    const [reactVisible, setReactVisible] = useState(false);

    useEffect(() => {
        const parentNav = navigation.getParent();
        parentNav?.setOptions({ tabBarStyle: { display: 'none' }, headerShown: false });
        return () => {
            parentNav?.setOptions({
                tabBarStyle: { backgroundColor: 'white', height: 60 },
                headerShown: true,
                headerTitle: () => <Header iconName1="qrcode-scan" iconName2="plus" />,
            });
        };
    }, [navigation]);

    const loadMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
            setToken(token); // Lưu token vào state

            if (!token) {
                Alert.alert('Error', 'You are not logged in!');
                return;
            }

            const userId = getUserIdFromToken(token);
            setCurrentUserId(userId);

            const data = await fetchMessages(chatId, token); // Gọi API để lấy danh sách tin nhắn
            setMessages(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch messages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadMessages();
        }, []),
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading messages...</Text>
            </View>
        );
    }

    const getReactionsForMessage = (messageId) => {
        // return chatData.reaction
        //     .filter((reaction) => reaction.messageId.toString() === messageId.toString())
        //     .reduce((acc, curr) => {
        //         acc[curr.reaction] = (acc[curr.reaction] || 0) + curr.sum;
        //         return acc;
        //     }, {});
        return {};
    };

    const sendMessage = (text) => {

        Keyboard.dismiss();
    };

    const deleteMessage = (messageId) => {
        handleDeleteMessage(messageId, messages, setMessages);
    };

    const sendVoice = async () => {
        await sendVoiceMessage(recordingUri, setIsRecording, setRecordingUri, setRecordingSaved, messages, setMessages);
    };

    function showReactionOptions(messageId) {
        setSelectedMessage(messageId);
        setReactVisible(true);
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <SafeAreaProvider>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            const hasReaction = Object.keys(getReactionsForMessage(item.id)).length > 0;
                            return (
                                <TouchableOpacity
                                    onLongPress={() =>
                                        handleLongPressMessage(
                                            item.id,
                                            messages,
                                            setMessages,
                                            token
                                        )
                                    }
                                >
                                    <View
                                        style={[
                                            styles.messageContainer,
                                            item.senderId === currentUserId ? styles.myMessage : styles.otherMessage,
                                        ]}
                                    >

                                        <Text style={styles.sender}>{item.sender.name}</Text>

                                        {item.audioUri && (
                                            <TouchableOpacity
                                                onPress={() => playAudio(item.audioUri)}
                                                style={styles.playButton}
                                            >
                                                <Ionicons name="play-circle" size={30} color="blue" />
                                            </TouchableOpacity>
                                        )}

                                        {item.image && (
                                            <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
                                                <Image
                                                    source={{ uri: item.image }}
                                                    style={{ width: 200, height: 200, borderRadius: 10 }}
                                                />
                                            </TouchableOpacity>
                                        )}

                                        {item.fileUri && (
                                            <TouchableOpacity
                                                onPress={() => downloadFile(item.fileUri, item.fileName)}
                                                style={styles.fileContainer}
                                            >
                                                <Ionicons name="document-text-outline" size={24} color="blue" />
                                                <Text style={styles.fileName}>
                                                    {item.fileName} ({(item.fileSize / 1024).toFixed(2)} KB)
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        {/* Nội dung tin nhắn */}
                                        <Text style={styles.message}>{item.content}</Text>

                                        {/* Hiển thị reaction và thời gian */}
                                        <View style={styles.timeReactionContainer}>
                                            <Text style={styles.time}>{formatDateTime(item.time)}</Text>

                                            {Object.keys(getReactionsForMessage(item.id)).length > 0 && (
                                                <View style={styles.reactionContainer}>
                                                    {Object.entries(getReactionsForMessage(item.id)).map(
                                                        ([emoji, count]) => (
                                                            <TouchableOpacity
                                                                key={emoji}
                                                                onPress={() => deleteReaction(item.id, emoji)}
                                                            >
                                                                <Text style={styles.reactionText}>
                                                                    {emoji} {count}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ),
                                                    )}
                                                </View>
                                            )}
                                        </View>

                                        {/* Nút thả reaction */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                showReactionOptions(item.id);
                                                setMessageId(item.id);
                                            }}
                                            style={{ position: 'absolute', right: 5, bottom: 9 }}
                                        >
                                            <FontAwesome name="smile-o" size={20} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                    <ChatInputContainer
                        message={message}
                        setMessage={setMessage}
                        onSendMessage={sendMessage}
                        onSendFile={() => sendFile(messages, setMessages)}
                        onSendImage={() => sendImage(messages, setMessages)}
                        onOpenEmojiPicker={() => setReactVisible(true)}
                        onOpenVoiceRecorder={() => setModalRecordVisible(true)}
                    />
                    {/* Modal ghi âm */}
                    <Modal animationType="slide" transparent={true} visible={modalRecordVisible}>
                        <View style={styles.modalRecordContainer}>
                            <Text style={styles.modalRecordTitle}>Voice Recorder</Text>

                            {/* Trạng thái ghi âm */}
                            {isRecording ? <Text style={styles.recordingText}>Recording...</Text> : null}

                            <View style={styles.buttonContainer}>
                                {/* Bắt đầu ghi âm */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => startRecording(setIsRecording)}
                                    disabled={isRecording}
                                >
                                    <Text style={styles.buttonText}>Start</Text>
                                </TouchableOpacity>

                                {/* Dừng ghi âm */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => stopRecording(setIsRecording, setRecordingUri, setRecordingSaved)}
                                    disabled={!isRecording}
                                >
                                    <Text style={styles.buttonText}>Stop</Text>
                                </TouchableOpacity>

                                {/* Gửi tin nhắn ghi âm */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        sendVoice();
                                        setModalRecordVisible(false);
                                    }}
                                    disabled={!recordingUri}
                                >
                                    <Text style={styles.buttonText}>Send</Text>
                                </TouchableOpacity>

                                {/* Hủy ghi âm */}
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalRecordVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal hiển thị ảnh lớn */}
                    <Modal visible={!!selectedImage} transparent={true} animationType="fade">
                        <TouchableOpacity
                            style={styles.modalContainer}
                            onPress={() => setSelectedImage(null)} // Đóng modal khi nhấn ra ngoài
                        >
                            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                        </TouchableOpacity>
                    </Modal>

                    {/* Modal hiển thị reaction */}
                    <Modal visible={reactVisible} transparent={true} animationType="fade">
                        <TouchableWithoutFeedback onPress={() => setReactVisible(false)}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 20,
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                    }}
                                >
                                    {reactionsList.map((emoji) => (
                                        <TouchableOpacity key={emoji} onPress={() => handleSelectReaction(emoji)}>
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    marginHorizontal: 10,
                                                }}
                                            >
                                                {emoji}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </SafeAreaProvider>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E4E8F3' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#e6f7ff', // Light blue header background
    },

    recipientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF', // Match header text color
        flex: 1,
        textAlign: 'center',
    },

    messageContainer: {
        padding: 12,
        marginVertical: 6,
        borderRadius: 15,
        maxWidth: '75%',
        position: 'relative',
        borderWidth: 1, // Add border
        borderColor: '#C6C6C6', // Border color
    },

    myMessage: {
        backgroundColor: '#d1f0ff', // Light blue for sent messages
        alignSelf: 'flex-end',
        marginRight: 10,
    },

    otherMessage: {
        backgroundColor: '#ffffff', // White for received messages
        alignSelf: 'flex-start',
        marginLeft: 10,
    },

    sender: {
        fontWeight: 'bold',
        color: '#007AFF',
    },

    message: {
        fontSize: 16,
        color: '#333', // Neutral text color
        lineHeight: 22,
    },

    timeReactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },

    time: {
        fontSize: 12,
        color: '#999', // Softer gray for timestamps
    },

    reactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    reactionText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666', // Softer gray for reactions
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },

    input: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        height: 40,
        marginHorizontal: 10,
        fontSize: 16,
    },

    playButton: {
        marginRight: 10,
    },

    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },

    fileName: {
        marginLeft: 10,
        fontSize: 14,
        color: '#007AFF', // Match header accent color
    },

    iconButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
