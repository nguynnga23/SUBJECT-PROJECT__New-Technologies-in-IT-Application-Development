import React, { useState } from 'react';
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
import { unPinMess } from '../services/privateChat/PrivateChatInfoService';
import { socket } from '../../../configs/socket';

export default function PinnedMessages({ pinMess, setPinMess, token, chatId }) {
    const [pinVisible, setPinVisible] = useState(false);
    const handleUnPinMessage = async (messageId) => {
        if (!messageId) return;
        try {
            const response = await unPinMess(messageId, token); // Gọi API để unpin tin nhắn
            if (response.error) {
                console.warn('Error unpinning message:', response.error);
                return;
            }
            socket.emit("pin_message", { chatId });
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
                <TouchableWithoutFeedback onPress={() => setPinVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Pinned Messages</Text>
                            {Array.isArray(pinMess) && pinMess.length > 0 ? (
                                <ScrollView style={{ width: '100%' }}>
                                    {pinMess.map((message, index) => (
                                        <View key={index} style={styles.pinnedMessageContainer}>
                                            <Text style={styles.pinnedMessageText}>{message.content}</Text>
                                            <Button
                                                title="Un-pin"
                                                color="red"
                                                onPress={() => handleUnPinMessage(message.id)}
                                            />
                                        </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 5,
    },
    pinnedMessageText: {
        flex: 1,
        fontSize: 16,
        color: '#555',
    },
    noPinnedMessageText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginVertical: 20,
    },
});