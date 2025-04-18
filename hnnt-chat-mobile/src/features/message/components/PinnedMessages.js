import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Button,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { formatDateTime } from '../../../utils/formatDateTime';
import { unPinMess } from '../services/privateChat/PrivateChatInfoService';
import { socket } from '../../../configs/socket';

export default function PinnedMessages({ pinMess, setPinMess, token, chatId, flatListRef }) {
    const [pinVisible, setPinVisible] = useState(false);

    const handleScrollToMessage = (messageId) => {
        if (!messageId) return;

        const message = pinMess.find((msg) => msg.id === messageId);

        // Kiểm tra nếu tin nhắn đã bị xóa
        if (!message || message.deletedBy.length > 0 || message.destroy) {
            alert('This message has been deleted and cannot be accessed.');
            return;
        }

        // Tìm vị trí của tin nhắn trong danh sách
        const messageIndex = pinMess.findIndex((msg) => msg.id === messageId);

        if (messageIndex !== -1 && flatListRef?.current) {
            flatListRef.current.scrollToIndex({ index: messageIndex, animated: true });
            setPinVisible(false); // Đóng modal sau khi cuộn
        }
    };

    const handleUnPinMessage = async (messageId) => {
        if (!messageId) return;

        try {
            const response = await unPinMess(messageId, token);
            if (response) {
                // Cập nhật danh sách tin nhắn đã ghim
                setPinMess((prevPinMess) => prevPinMess.filter((msg) => msg.id !== messageId));
                socket.emit('del_message', { chatId });
            }
        } catch (error) {
            console.warn('Error unpinning message:', error);
        }
    };

    return (
        <>
            <TouchableOpacity
                style={styles.pinnedBar}
                onPress={() => setPinVisible(true)} // Hiển thị modal khi nhấn vào thanh pinned
            >
                <Text style={styles.pinnedBarText}>
                    📌 {pinMess.length} Pinned Message{pinMess.length > 1 ? 's' : ''}
                </Text>
            </TouchableOpacity>

            <Modal visible={pinVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setPinVisible(false)} accessible={false}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Pinned Messages</Text>
                            {Array.isArray(pinMess) && pinMess.length > 0 ? (
                                <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="handled">
                                    {pinMess.map((message, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.pinnedMessageContainer}
                                            onPress={() => handleScrollToMessage(message.id)}
                                        >
                                            <View style={styles.messageInfo}>
                                                {message && !message.deletedBy.length && !message.destroy ? (
                                                    <>
                                                        <Text style={styles.messageTime}>
                                                            {formatDateTime(message.time)}
                                                        </Text>
                                                        <Text style={styles.messageSender}>{message.sender.name}</Text>
                                                        {message.type !== 'text' ? (
                                                            <Text style={styles.pinnedMessageText}>
                                                                {message.fileName}
                                                            </Text>
                                                        ) : (
                                                            <Text style={styles.pinnedMessageText}>
                                                                {message.content}
                                                            </Text>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Text style={styles.noPinnedMessageText}>
                                                        This message has been deleted or destroyed.
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={styles.buttonContainer}>
                                                <Button
                                                    title="Un-pin"
                                                    color="red"
                                                    onPress={() => handleUnPinMessage(message.id)}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Text style={styles.noPinnedMessageText}>No pinned messages</Text>
                            )}
                            <Button title="Close" onPress={() => setPinVisible(false)} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    pinnedBar: {
        //màu xám mờ
        backgroundColor: 'rgba(240, 240, 240, 0.4)',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    pinnedBarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    pinnedMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9', // Màu nền sáng
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageInfo: {
        flex: 1,
        marginRight: 10,
    },
    messageTime: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    messageSender: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    pinnedMessageText: {
        fontSize: 14,
        color: '#555',
    },
    noPinnedMessageText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginVertical: 20,
    },
});
