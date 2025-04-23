import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserIdFromToken } from '../../../utils/auth';
import { socket } from '../../../configs/socket';
import { deleteMessage, destroyMessage, pinMessage } from '../services/ChatService';

let setModalStateGlobal = null;

export function MessageOptionsModal() {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);
    const [title, setTitle] = useState('');

    // Expose setter to be used outside this component
    setModalStateGlobal = ({ visible, title, options }) => {
        setVisible(visible);
        setTitle(title);
        setOptions(options);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.optionButton}
                            onPress={async () => {
                                setVisible(false);
                                setTimeout(() => opt.onPress(), 300);
                            }}
                        >
                            <Text style={styles.optionText}>{opt.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

// Gọi khi nhấn giữ
export async function handleLongPressMessage(
    messageId,
    messages,
    setMessages,
    chatId,
    token,
    setReplyMessage,
    setModalReplyVisible,
    setModalForwardVisible,
    setSelectedForwardMessage, // Add this parameter to store the selected message
) {
    const message = messages.find((msg) => msg.id === messageId);

    if (!message || !setModalStateGlobal) return;

    let options = [];

    if (message.destroy) {
        options.push({
            text: '🗑️ Delete',
            onPress: async () => {
                try {
                    if (!messageId || !token) return;
                    const response = await deleteMessage(messageId, token);
                    socket.emit('del_message', { chatId });
                    showMessage('Success', response.message);
                } catch {
                    showMessage('Error', 'Failed to delete the message.');
                }
            },
        });
    } else {
        options = [
            {
                text: '📌 Pin',
                onPress: async () => {
                    try {
                        if (!messageId || !token) return;
                        await pinMessage(messageId, token);
                        socket.emit('pin_message', { chatId });
                        showMessage('Success', 'Pinned!');
                    } catch {
                        showMessage('Error', 'Failed to pin the message.');
                    }
                },
            },
            {
                text: '↩️ Answer',
                onPress: () => {
                    setReplyMessage(message);
                    setModalReplyVisible(true);
                },
            },
            {
                text: '🔄 Forward',
                onPress: () => {
                    setSelectedForwardMessage(message); // Save the selected message
                    setModalForwardVisible(true); // Open the forward modal
                },
            },
            {
                text: '🗑️ Delete',
                onPress: async () => {
                    try {
                        if (!messageId || !token) return;
                        const response = await deleteMessage(messageId, token);
                        socket.emit('del_message', { chatId });
                        showMessage('Success', response.message);
                    } catch {
                        showMessage('Error', 'Failed to delete the message.');
                    }
                },
            },
        ];

        if (message.sender.id === getUserIdFromToken(token)) {
            options.splice(4, 0, {
                text: 'Recall',
                onPress: async () => {
                    try {
                        if (!messageId || !token) return;
                        await destroyMessage(messageId, token);
                        socket.emit('del_message', { chatId });
                        showMessage('Success', 'Recall message success!');
                    } catch {
                        showMessage('Error', 'Failed to recall the message.');
                    }
                },
            });
        }
    }

    // Gọi modal
    setModalStateGlobal({
        visible: true,
        title: 'What do you want to do with this message?',
        options,
    });
}

// Tạm thay Alert.alert
function showMessage(title, message) {
    setModalStateGlobal({
        visible: true,
        title,
        options: [
            {
                text: 'OK',
                onPress: () => { },
            },
        ],
    });
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        minWidth: 280,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    optionButton: {
        paddingVertical: 12,
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
