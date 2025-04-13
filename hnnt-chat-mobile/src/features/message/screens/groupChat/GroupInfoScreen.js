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
    Alert,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../utils/auth';
import {
    handleReport,
    leaveGroup,
    toggleMute,
    editGroupName,
    handleChangeAvatar,
    disbandGroup,
    fetchChat,
    getPinMess,
    unPinMess,
} from '../../services/GroupChat/GroupInfoService';

export default function GroupInfoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const chatId = route.params?.chatId || 'null';
    const [isMuted, setIsMuted] = useState();
    const [editVisible, setEditVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    // const [reportVisible, setReportVisible] = useState(false);
    const [leaveVisible, setLeaveVisible] = useState(false);
    // const [reportReason, setReportReason] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [disbandVisible, setDisbandVisible] = useState(false);
    const [pinVisible, setPinVisible] = useState(false);
    const [pinMess, setPinMess] = useState([]);
    const [numberOfMembers, setNumberOfMembers] = useState('');

    const fetchChatInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const chatInfo = await fetchChat(chatId, token); // Replace with actual token
            setNewGroupName(chatInfo.name);
            setAvatar(chatInfo.avatar);
            const userId = getUserIdFromToken(token);
            const participant = chatInfo.participants.find((p) => p.accountId === userId);
            if (participant) {
                setUserRole(participant.role); // Lưu vai trò vào state
                setIsMuted(participant.notify);
            }
            setNumberOfMembers('View members (' + chatInfo.participants.length + ')');

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
    };

    const handleEditGroupName = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await editGroupName(newGroupName, chatId, token);
            setNewGroupName(response.name);
            setEditVisible(false);
            fetchChatInfo();
            Alert.alert('Success', response.message);
        } catch (error) {
            console.warn('Error editing group name:', error);
        }
    };

    useEffect(() => {
        fetchChatInfo();
    }, [chatId]);

    useFocusEffect(
        useCallback(() => {
            fetchChatInfo();
        }, []),
    );

    const handleToggleMute = async () => {
        try {
            console.log('Toggling mute for chatId:', chatId);
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

            // Cập nhật danh sách tin nhắn được ghim
            const updatedPinMess = pinMess.filter((message) => message.id !== messageId);
            setPinMess(updatedPinMess);
        } catch (error) {
            console.warn('Error unpinning message:', error);
        }
    };

    const handleDisbandGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await disbandGroup(chatId, token);
            Alert.alert('Success', response.message);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MessageScreen' }],
            });
        } catch (error) {
            console.warn('Error disbanding group:', error);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await leaveGroup(chatId, token);
            Alert.alert('Success', response.message);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MessageScreen' }],
            });
        } catch (error) {
            console.warn('Error leaving group:', error);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaProvider>
                <ScrollView>
                    {/* Group Info */}
                    <View style={styles.groupInfo}>
                        {avatar && (
                            <Image
                                source={{
                                    uri:
                                        avatar ||
                                        'https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg',
                                }}
                                style={styles.groupImage}
                            />
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.groupName}>{newGroupName}</Text>
                            {userRole === 'LEADER' && (
                                <TouchableOpacity onPress={() => setEditVisible(true)}>
                                    <AntDesign style={{ marginTop: 7 }} name="edit" size={24} color="black" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => navigation.navigate('FindGrMessagesScreen')}>
                            <ActionButton icon="search" label="Search messages" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('FindGrMessagesScreen')}>
                            <ActionButton icon="person-add" label="Add members" />
                        </TouchableOpacity>
                        {userRole === 'LEADER' && (
                            <TouchableOpacity onPress={() => handleChangeAvatar(setAvatar)}>
                                <ActionButton icon="image" label="Change avatar" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={() => handleToggleMute()}>
                            <ActionButton
                                icon={isMuted ? 'notifications' : 'notifications-off'}
                                label={isMuted ? 'Unmute' : 'Mute'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Other Options */}
                    <TouchableOpacity>
                        <OptionItem label="Image, file, link" icon="folder" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPinVisible(true)}>
                        <OptionItem label="Pinned message" icon="pin" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('MemberListScreen', { chatId })}>
                        <OptionItem label={numberOfMembers} icon="people" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('AddMemberScreen', { chatId })}>
                        <OptionItem label="Add member" icon="person-add" />
                    </TouchableOpacity>

                    {/* Group Links */}
                    {/* <OptionItem
                        label="Link to join group"
                        textColor="black"
                        links={[
                            { text: "https://zalo.me/g/deuqlw127", url: "https://zalo.me/g/deuqlw127" },
                        ]}
                    /> */}

                    {/* Danger Zone */}
                    {/* <TouchableOpacity onPress={() => setReportVisible(true)}>
                        <OptionItem label="Report" textColor="red" />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => setLeaveVisible(true)}>
                        <OptionItem label="Leave group" icon="exit" textColor="red" />
                    </TouchableOpacity>
                    {userRole === 'LEADER' && (
                        <TouchableOpacity onPress={() => setDisbandVisible(true)}>
                            <OptionItem label="Disband group" icon="trash" textColor="red" />
                        </TouchableOpacity>
                    )}

                    {/* edit groupname modal */}
                    <Modal visible={editVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Edit Group Name</Text>
                                <TextInput style={styles.input} value={newGroupName} onChangeText={setNewGroupName} />
                                <View style={styles.modalActions}>
                                    <Button title="Cancel" color="red" onPress={() => setEditVisible(false)} />
                                    <Button title="Apply" onPress={() => handleEditGroupName()} />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Report Modal */}
                    {/* <Modal visible={reportVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Report</Text>
                                <TouchableOpacity onPress={() => setReportReason("Sensitive content")}>
                                    <Text style={styles.option}>Sensitive content</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setReportReason("Scam")}>
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
                                    <Button title="Submit" onPress={() => handleReport(reportReason, setReportVisible)} />
                                </View>
                            </View>
                        </View>
                    </Modal> */}

                    {/* Leave Group Modal */}
                    <Modal visible={leaveVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Leave Group</Text>
                                <Text>Are you sure you want to leave this group?</Text>
                                <View style={styles.modalActions}>
                                    <Button title="Cancel" onPress={() => setLeaveVisible(false)} />
                                    <Button title="Leave" color="red" onPress={() => handleLeaveGroup()} />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Disband Group Modal */}
                    <Modal visible={disbandVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Disband Group</Text>
                                <Text>Are you sure you want to disband this group? This action cannot be undone.</Text>
                                <View style={styles.modalActions}>
                                    <Button title="Cancel" onPress={() => setDisbandVisible(false)} />
                                    <Button title="Disband" color="red" onPress={() => handleDisbandGroup()} />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Pin Modal */}
                    {/* <Modal visible={pinVisible} transparent animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setPinVisible(false)}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>{pinMess}</Text>

                                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10, width: "100%" }}>
                                        <Button title="Un-pin" color="red" onPress={() => handleUnPinMess()} />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal> */}
                    <Modal visible={pinVisible} transparent animationType="slide">
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
                </ScrollView>
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

    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    groupInfo: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    groupImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderColor: '#0078D7',
    },
    groupName: {
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
