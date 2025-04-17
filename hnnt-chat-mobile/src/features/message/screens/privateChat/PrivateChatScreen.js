import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    fetchMessages,
    sendMessage,
    sendReaction,
    removeReaction,
    prepareImage,
    downloadImage,
    prepareFile,
    downloadAnyFile,
    startRecording,
    stopRecording,
    sendVoiceMessage,
    playAudio,
} from '../../services/privateChat/PrivateChatService';
import { getPinMess } from '../../services/privateChat/PrivateChatInfoService';

import { handleLongPressMessage, MessageOptionsModal } from '../../components/MessageOptions';
import PinnedMessages from '../../components/PinnedMessages';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../utils/auth';
import { formatDateTime } from '../../../../utils/formatDateTime';
import { socket } from '../../../../configs/socket';
import { set } from 'date-fns';

export default function PrivateChatScreen() {
    const flatListRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId, chatName } = route.params;
    const [currentUserId, setCurrentUserId] = useState(null);
    const [token, setToken] = useState(null);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageId, setMessageId] = useState(null);
    const [replyMessage, setReplyMessage] = useState(null);
    const [replyVisible, setReplyVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const [modalZoomVisible, setModalZoomVisible] = useState(false);
    const [modalDownVisible, setModalDownVisible] = useState(false);
    const [modalDownFileVisible, setModalDownFileVisible] = useState(false);
    const [modalRecordVisible, setModalRecordVisible] = useState(false);
    const [modalReplyVisible, setModalReplyVisible] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState(null);
    const [recordingSaved, setRecordingSaved] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const reactionsList = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    const [reactVisible, setReactVisible] = useState(false);

    const [selectedReaction, setSelectedReaction] = useState(null);
    const [reactionDetailsVisible, setReactionDetailsVisible] = useState(false);

    const [pinMess, setPinMess] = useState([]);

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

            try {
                const pin_Mess = await getPinMess(chatId, token);
                setPinMess(pin_Mess);
            } catch (error) {
                setPinMess([]);
            }

            // Cuộn đến tin nhắn cuối cùng
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch messages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    //send message
    useEffect(() => {
        const handleReceiveMessage = ({ chatId: receivedChatId, newMessage }) => {
            if (chatId !== receivedChatId) {
                return;
            }
            // loadMessages();
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [chatId]);

    //del and destroy
    useEffect(() => {
        const handleRender = ({ chatId: receivedChatId }) => {
            if (chatId !== receivedChatId) {
                return;
            }
            loadMessages();
        };
        socket.on('render_message', handleRender);
        return () => {
            socket.off('render_message', handleRender);
        };
    }, [chatId]);

    //reaction
    useEffect(() => {
        const handleRender = ({ chatId: receivedChatId }) => {
            if (chatId !== receivedChatId) {
                return;
            }
            loadMessages();
        };
        socket.on('receive_reaction_message', handleRender);
        return () => {
            socket.off('receive_reaction_message', handleRender);
        };
    }, [chatId]);

    //pin message
    useEffect(() => {
        const handleRender = ({ chatId: receivedChatId }) => {
            if (chatId !== receivedChatId) {
                return;
            }
            loadMessages();
        };
        socket.on('receive_pin_message', handleRender);
        return () => {
            socket.off('receive_pin_message', handleRender);
        };
    }, [chatId]);

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

    const handleSendMessage = async (content) => {
        Keyboard.dismiss();
        try {
            const response = await sendMessage(chatId, content, 'text', replyMessage?.id, null, null, null, token);
            if (replyMessage === null) {
                socket.emit('send_message', {
                    chatId: chatId,
                    newMessage: response,
                });
            } else {
                socket.emit('del_message', {
                    chatId: chatId,
                });
            }
            setReplyMessage(null);
            // loadMessages();
        } catch (error) {
            console.warn('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message.');
        }
    };

    const handleSelectReaction = async (emoji) => {
        if (selectedMessage) {
            try {
                const userId = getUserIdFromToken(token);
                const response = await sendReaction(selectedMessage, userId, emoji, token);
                socket.emit('reaction_message', {
                    chatId: chatId
                });
                setReactVisible(false);
            } catch (error) {
                console.warn('Error sending reaction:', error);
                Alert.alert('Error', 'Failed to send reaction.');
            }
        }
    };

    const handleRemoveReaction = async () => {
        if (selectedMessage) {
            try {
                const userId = getUserIdFromToken(token);
                await removeReaction(selectedMessage, userId, token);
                socket.emit('del_message', {
                    chatId: chatId,
                });
                setReactionDetailsVisible(false); // Đóng modal sau khi xóa
            } catch (error) {
                console.warn('Error removing reaction:', error);
                Alert.alert('Error', 'Failed to remove reaction.');
            }
        }
    };

    function showReactionOptions(messageId) {
        setSelectedMessage(messageId);
        setReactVisible(true);
    }

    const handleShowReactionDetails = (reaction, reactions, id) => {
        setSelectedMessage(id);
        const filteredReactions = reactions.filter((r) => r.reaction === reaction);
        setSelectedReaction(filteredReactions);
        setReactionDetailsVisible(true);
    };

    const groupReactions = (reactions) => {
        const grouped = reactions.reduce((acc, curr) => {
            if (!acc[curr.reaction]) {
                acc[curr.reaction] = 0;
            }
            acc[curr.reaction] += curr.sum;
            return acc;
        }, {});
        return Object.entries(grouped).map(([reaction, sum]) => ({ reaction, sum }));
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <SafeAreaProvider>
                    <>
                        {/* Thanh pinned messages */}
                        <PinnedMessages
                            pinMess={pinMess}
                            setPinMess={setPinMess}
                            token={token}
                            chatId={chatId}
                            flatListRef={flatListRef}
                        />
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                const hasReactions = item.reactions && item.reactions.length > 0;
                                const groupedReactions = hasReactions ? groupReactions(item.reactions) : [];
                                return (
                                    <TouchableOpacity
                                        onLongPress={() =>
                                            handleLongPressMessage(
                                                item.id,
                                                messages,
                                                setMessages,
                                                chatId,
                                                token,
                                                setReplyMessage,
                                                setModalReplyVisible,
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

                                            {/* Kiểm tra nếu tin nhắn bị thu hồi */}
                                            {item.destroy ? (
                                                <Text style={styles.recalledMessage}>message had recall</Text>
                                            ) : (
                                                <>
                                                    {item.replyToId !== null && (
                                                        <View style={styles.replyBox}>
                                                            <Text style={styles.replyUser}>Replying to {item.replyTo.sender.name}</Text>
                                                            <Text style={styles.replyMessage}>{item.replyTo.content}</Text>
                                                        </View>
                                                    )}

                                                    {/* Hiển thị nội dung tin nhắn */}
                                                    {item.type === 'text' && (
                                                        <Text style={styles.message}>{item.content}</Text>
                                                    )}

                                                    {/* Hiển thị file, hình ảnh, hoặc audio nếu có */}
                                                    {item.audioUri && (
                                                        <TouchableOpacity
                                                            onPress={() => playAudio(item.audioUri)}
                                                            style={styles.playButton}
                                                        >
                                                            <Ionicons name="play-circle" size={30} color="blue" />
                                                        </TouchableOpacity>
                                                    )}

                                                    {item.type === 'image' && (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedImage(item.fileName);
                                                                setModalZoomVisible(true);
                                                            }}
                                                            onLongPress={() => {
                                                                setSelectedImage(item.fileName);
                                                                setModalDownVisible(true);
                                                            }}
                                                        >
                                                            <Image
                                                                source={{ uri: item.fileName }}
                                                                style={{ width: 200, height: 200, borderRadius: 10 }}
                                                            />
                                                        </TouchableOpacity>
                                                    )}

                                                    {item.type === 'file' && (
                                                        <TouchableOpacity
                                                            onLongPress={() => {
                                                                setSelectedFile(item.fileName);
                                                                setModalDownFileVisible(true);
                                                            }}
                                                            style={styles.fileContainer}
                                                        >
                                                            <Ionicons name="document-text-outline" size={24} color="blue" />
                                                            <Text style={styles.fileName}>
                                                                {item.content} {item.fileSize}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </>
                                            )}

                                            {/* Hiển thị reaction và thời gian */}
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={styles.timeReactionContainer}>
                                                    <Text style={styles.time}>{formatDateTime(item.time)}</Text>
                                                </View>

                                                {!item.destroy && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            showReactionOptions(item.id);
                                                            setMessageId(item.id);
                                                        }}
                                                        style={{ justifyContent: 'flex-end', marginLeft: '10' }}
                                                    >
                                                        <FontAwesome name="smile-o" size={20} color="gray" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            {hasReactions && !item.destroy && (
                                                <View style={styles.reactionContainer}>
                                                    {groupedReactions.map((reaction, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={styles.reactionItem}
                                                            onPress={() => handleShowReactionDetails(reaction.reaction, item.reactions, item.id)}
                                                        >
                                                            <Text style={styles.reactionText}>
                                                                {reaction.reaction} {reaction.sum}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            initialNumToRender={20}
                            keyboardShouldPersistTaps="handled" // Đảm bảo sự kiện nhấn không chặn cuộn
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Cuộn xuống cuối khi nội dung thay đổi
                        />
                        <ChatInputContainer
                            message={message}
                            setMessage={setMessage}
                            onSendMessage={() => handleSendMessage(message)}
                            onSendFile={() => prepareFile(chatId, token, replyMessage?.id)}
                            onSendImage={() => prepareImage(chatId, token, replyMessage?.id)}
                            onOpenVoiceRecorder={() => setModalRecordVisible(false)}
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
                        <Modal visible={modalZoomVisible} transparent={true} animationType="fade">
                            <TouchableOpacity
                                style={styles.modalContainer}
                                onPress={() => setModalZoomVisible(false)} // Đóng modal khi nhấn ra ngoài
                            >
                                <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                            </TouchableOpacity>
                        </Modal>

                        {/* Modal tải ảnh */}
                        <Modal visible={modalDownVisible} transparent={true} animationType="fade">
                            <TouchableWithoutFeedback onPress={() => setModalDownVisible(false)}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.optionModal}>
                                        <Text style={styles.modalTitle}>Download this image?</Text>
                                        <View style={styles.modalButtonContainer}>
                                            <TouchableOpacity
                                                style={styles.modalButton}
                                                onPress={() => {
                                                    downloadImage(selectedImage); // Gọi hàm tải ảnh
                                                    setModalDownVisible(false); // Đóng modal
                                                }}
                                            >
                                                <Text style={styles.modalButtonText}>Download</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.modalButton, styles.cancelButton]}
                                                onPress={() => setModalDownVisible(false)} // Đóng modal
                                            >
                                                <Text style={styles.modalButtonText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>

                        {/* Modal tải file */}
                        <Modal visible={modalDownFileVisible} transparent={true} animationType="fade">
                            <TouchableWithoutFeedback onPress={() => setModalDownFileVisible(false)}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.optionModal}>
                                        <Text style={styles.modalTitle}>Download this file?</Text>
                                        <View style={styles.modalButtonContainer}>
                                            <TouchableOpacity
                                                style={styles.modalButton}
                                                onPress={() => {
                                                    downloadAnyFile(selectedFile);
                                                    setModalDownFileVisible(false);
                                                }}
                                            >
                                                <Text style={styles.modalButtonText}>Download</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.modalButton, styles.cancelButton]}
                                                onPress={() => setModalDownFileVisible(false)}
                                            >
                                                <Text style={styles.modalButtonText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
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

                        {/* Modal reaction detail */}
                        <Modal visible={reactionDetailsVisible} transparent={true} animationType="fade">
                            <TouchableWithoutFeedback onPress={() => setReactionDetailsVisible(false)}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.reactionDetailsModal}>
                                        <Text style={styles.modalTitle}>Reaction Details</Text>
                                        {selectedReaction?.map((reaction, index) => (
                                            <View key={index} style={styles.reactionDetailItem}>
                                                <Image
                                                    source={{ uri: reaction.user.avatar }}
                                                    style={styles.userAvatar}
                                                />
                                                <Text style={styles.userName}>{reaction.user.name}</Text>

                                                {reaction.user.id === currentUserId && (
                                                    <TouchableOpacity
                                                        style={styles.removeButton}
                                                        onPress={() => handleRemoveReaction()}
                                                    >
                                                        <Text style={styles.removeButtonText}>Remove</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>

                        {/* Modal trả lời tin nhắn */}
                        <Modal visible={modalReplyVisible} animationType="slide" transparent={true}>
                            <TouchableWithoutFeedback onPress={() => setModalReplyVisible(false)}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalReplyContent}>
                                        {replyMessage && (
                                            <View style={styles.replyBox}>
                                                <Text style={styles.replyUser}>Replying to {replyMessage.sender.name}</Text>
                                                <Text style={styles.replyMessage}>{replyMessage.content}</Text>
                                            </View>
                                        )}
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.inputAnswer}
                                                placeholder="Enter message..."
                                                value={message}
                                                onChangeText={setMessage}
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleSendMessage(message);
                                                    setMessage('');
                                                    setModalReplyVisible(false);
                                                }}
                                            >
                                                <Icon name="send" size={30} color="#007AFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                        <MessageOptionsModal />
                    </>
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
        flex: 1,
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

    recalledMessage: {
        fontStyle: 'italic',
        color: '#999', // Màu xám nhạt
        fontSize: 16,
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
        flexDirection: 'row', // Hiển thị các emoji theo hàng ngang
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap', // Đảm bảo các emoji không bị tràn ra ngoài
        justifyContent: 'flex-start', // Căn trái
        maxWidth: '100%', // Giới hạn chiều rộng để không vượt quá messageContainer
    },
    reactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 5,
    },
    reactionText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    reactionDetailsModal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },

    removeButton: {
        marginLeft: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FF3B30',
        borderRadius: 5,
    },

    removeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    fullImage: {
        width: '95%',
        height: '95%',
    },

    reactionDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },

    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    userName: {
        fontSize: 16,
        color: '#333',
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
        maxWidth: 'auto',
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

    optionModal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        marginHorizontal: 10,
    },

    cancelButton: {
        backgroundColor: '#FF3B30',
    },

    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    //reply
    modalReplyContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    replyBox: {
        width: '100%',
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 10,
    },
    replyUser: {
        fontWeight: 'bold',
        color: '#333',
    },
    replyMessage: {
        color: '#555',
        fontStyle: 'italic',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    inputAnswer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
});
