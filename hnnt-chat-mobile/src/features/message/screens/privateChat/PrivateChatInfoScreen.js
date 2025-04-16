import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    StyleSheet,
    Modal,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
    fetchChat, getPinMess, unPinMess,
    blockUser, deleteAllMessage, toggleMute
} from '../../services/privateChat/PrivateChatInfoService';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../utils/auth';

export default function PrivateChatInfoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const chatId = route.params?.chatId || 'null';
    const [newGroupName, setNewGroupName] = useState('');
    const [avatar, setAvatar] = useState(null);
    // const [userRole, setUserRole] = useState('');
    const [pinMess, setPinMess] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [blockVisible, setBlockVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [pinVisible, setPinVisible] = useState(false);

    const [userId, setUserId] = useState('');
    const [receiverId, setReceiverId] = useState('');

    const fetchChatInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const chatInfo = await fetchChat(chatId, token); // Replace with actual token
            setNewGroupName(chatInfo.name);
            setAvatar(chatInfo.avatar);

            const uid = getUserIdFromToken(token);
            setUserId(uid);
            const participant = chatInfo.participants.find((member) => member.accountId === uid);
            if (participant) {
                setIsMuted(participant.notify);
            } else {
                console.warn('User ID not found in participants list');
            }

            setReceiverId(chatInfo.participants.find((member) => member.accountId !== uid).accountId);

            try {
                const pin_Mess = await getPinMess(chatId, token);
                setPinMess(pin_Mess);
            } catch (error) {
                if (error.response?.status === 404) {
                    // Xử lý lỗi 404 một cách yên lặng
                    console.warn('No pinned message found.'); // Log cảnh báo nếu cần
                    setPinMess('No pinned message'); // Đặt giá trị mặc định
                } else {
                    // Xử lý các lỗi khác
                    console.warn('Error fetching pinned message:', error); // Log lỗi nếu cần
                    setPinMess(null); // Đặt giá trị mặc định nếu xảy ra lỗi khác
                }
            }
        } catch (error) {
            console.error('Error fetching chat info:', error);
        }
    }

    useEffect(() => {
        fetchChatInfo();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener('focus', () => {
                fetchChatInfo();
            });
            return unsubscribe;
        }, [navigation])
    );

    const handleToggleMute = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await toggleMute(chatId, token);
            setIsMuted(response.notify);
            Alert.alert('Success', response.message);
        } catch (error) {
            console.error('Error toggling mute:', error);
        }
    };

    const handleUnPinMessage = async (messageId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await unPinMess(messageId, token);
            Alert.alert('Success', response.message);

            const updatedPinMess = pinMess.filter((message) => message.id !== messageId);
            setPinMess(updatedPinMess);
        } catch (error) {
            console.warn('Error unpinning message:', error);
        }
    };

    const handleBlockUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await blockUser(userId, receiverId, token);
            setBlockVisible(false);
            Alert.alert('Success', response.message);
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.warn('Error blocking user:', error);
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaProvider>
                <View style={styles.chatInfo}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Text style={styles.recipientName}>{newGroupName}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate('FindPrMessagesScreen', { chatId })}>
                        <ActionButton icon="search" label="Find messages" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleMute()}>
                        <Ionicons name={isMuted ? 'notifications' : 'notifications-off'} size={24} color="black" />
                        <Text style={styles.actionText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Other Options */}
                <TouchableOpacity>
                    <OptionItem label="Image, file, link" icon="folder" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPinVisible(true)}>
                    <OptionItem label="Pinned message" icon="pin" />
                </TouchableOpacity>

                {/* Danger Zone */}
                <TouchableOpacity onPress={() => setBlockVisible(true)}>
                    <OptionItem label="Block user" icon="ban" textColor="red" />
                </TouchableOpacity>

                {/* Report Modal */}
                <Modal visible={reportVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Report</Text>
                            <TouchableOpacity onPress={() => setReportReason('Sensitive content')}>
                                <Text style={styles.option}>Sensitive content</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setReportReason('Scam')}>
                                <Text style={styles.option}>Scam</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                placeholder="Other reason..."
                                value={reportReason}
                                onChangeText={setReportReason}
                            />
                            <View style={styles.modalActions}>
                                <Button title="Cancel" onPress={() => setReportVisible(false)} />
                                <Button
                                    title="Submit"
                                    onPress={() => {
                                        handleReport(reportReason, setReportReason);
                                        setReportVisible(false);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Block modal */}
                <Modal visible={blockVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Block user</Text>
                            <Text>Are you sure you want to block this user?</Text>
                            <View style={styles.modalActions}>
                                <Button title="Cancel" onPress={() => setBlockVisible(false)} />
                                <Button
                                    title="Yes"
                                    color="red"
                                    onPress={() => handleBlockUser()}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Pin messenge modal */}
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
            </SafeAreaProvider>
        </View>
    );
}

// Component tái sử dụng cho các nút chức năng
const ActionButton = ({ icon, label }) => (
    <View style={styles.actionButton}>
        <View style={styles.iconContainer}>
            <Ionicons name={`${icon}-outline`} size={22} color="black" />
        </View>
        <Text style={styles.actionText}>{label}</Text>
    </View>
);

// Component tái sử dụng cho danh sách tùy chọn
const OptionItem = ({ label, icon, textColor = 'black', links = [] }) => (
    <View style={styles.optionItem}>
        <View style={styles.optionItemContent}>
            {icon && <Ionicons name={`${icon}-outline`} size={20} color="gray" style={styles.optionIcon} />}
            <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
        </View>
        {links.map((link, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(link.url)}>
                <Text style={[styles.linkText, { color: textColor }]}>{link.text}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        backgroundColor: '#005ae0',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    chatInfo: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderColor: '#0078D7',
    },
    recipientName: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 10,
        borderBottomColor: '#f9f9f9',
    },
    actionButton: {
        alignItems: 'center',
        width: 80,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 20,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    actionText: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 13,
        fontWeight: '500',
        color: '#555',
    },
    optionItem: {
        marginTop: 1,
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 2,
    },
    optionItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },

    linkText: {
        fontSize: 14,
        marginTop: 5,
        textDecorationLine: 'underline',
        color: '#0078D7',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
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
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
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
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginVertical: 10,
    },
});
