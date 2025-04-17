import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
    addFriend,
    cancelAddFriend,
    deleteMember,
    fetchChat,
    changeRole,
    getListFriendRequest,
    checkFriend,
} from '../../services/GroupChat/MemberListService';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../../utils/auth';

export default function MemberListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const chatId = route.params?.chatId || 'null';
    const [friendRequests, setFriendRequests] = useState({});
    const [hasFriendRequest, setHasFriendRequest] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [footerModalVisible, setFooterModalVisible] = useState(false); // State for footer modal visibility

    const [members, setMembers] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [myId, setMyId] = useState('');

    const openModal = (member, action) => {
        setSelectedMember(member);
        setModalAction(action);
        setModalVisible(true);
    };

    const getMemberAction = (member, friendRequests) => {
        if (member.accountId === myId) {
            return; // Không có hành động nào cho chính mình
        }
        // Kiểm tra nếu member có trong danh sách friendRequests
        const hasFriendRequest = friendRequests.some((request) => request.id === member.accountId);

        if (hasFriendRequest) {
            return 'remove'; // Có yêu cầu kết bạn
        }

        return 'add'; // Không có yêu cầu kết bạn
    };

    const handleCheckFriend = async (member, token) => {
        try {
            console.log('Checking friend status for member:', member.accountId, 'My ID:', myId);
            if (member.accountId === myId) {
                console.log('This is the current user. Skipping check.');
                return; // Không kiểm tra trạng thái bạn bè cho chính mình
            }
            const response = await checkFriend(member.accountId, token);
            console.log('Friend check response:', response);
            return response.result; // Trả về true hoặc false tùy thuộc vào trạng thái bạn bè
        } catch (error) {
            console.warn('Error checking friend status:', error);
            return false; // Mặc định là không phải bạn bè nếu có lỗi
        }
    };

    const fetchChatInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const chatInfo = await fetchChat(chatId, token); // Replace with actual token
            const userId = getUserIdFromToken(token);
            setMyId(userId); // Lưu userId vào state
            const participant = chatInfo.participants.find((p) => p.accountId === userId);
            if (participant) {
                setUserRole(participant.role); // Lưu vai trò vào state
            }

            const friendRequestsData = await getListFriendRequest(userId, token);

            const membersData = await Promise.all(
                chatInfo.participants.map(async (member) => {
                    const isUser = member.accountId === userId;
                    const isFriend = await handleCheckFriend(member, token); // Kiểm tra trạng thái bạn bè
                    return {
                        accId: member.accountId,
                        name: member.account.name,
                        role: member.role,
                        avatar: member.account.avatar,
                        isUser,
                        isFriend: isFriend,
                        action: isUser || isFriend ? 'none' : getMemberAction(member, friendRequestsData),
                    };
                }),
            );
            //console log for each membersdata
            membersData.forEach((member) => {
                console.log('Member data:', member.name, member.isFriend, member.action);
            });
            setMembers(membersData);
        } catch (error) {
            console.warn('Error fetching chat info:', error);
        }
    };

    useEffect(() => {
        fetchChatInfo();
    }, [chatId]);

    const handleChangeRole = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await changeRole(chatId, accId, token);
            Alert.alert('Success', response.message);
            fetchChatInfo(); // Refresh the member list after changing role
        } catch (error) {
            console.warn('Error changing role:', error);
        }
    };

    const handleDeleteMember = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await deleteMember(chatId, accId, token);
            Alert.alert('Success', response.message);
            fetchChatInfo(); // Refresh the member list after deleting member
        } catch (error) {
            console.warn('Error deleting member:', error);
        }
    };

    const handleAddFriend = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await addFriend(accId, token);
            Alert.alert('Success', 'success');
            fetchChatInfo();
        } catch (error) {
            console.warn('Error adding friend:', error);
        }
    };

    const handleCancelAddFriend = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const respone = await cancelAddFriend(accId, token);
            Alert.alert('Success', respone.message);
            fetchChatInfo(); // Refresh the member list after canceling friend request
        } catch (error) {
            console.warn('Error canceling friend request:', error);
        }
    };

    const confirmAction = () => {
        if (!selectedMember) return;

        if (modalAction === 'add') {
            handleAddFriend(selectedMember.accId);
        } else if (modalAction === 'remove') {
            handleCancelAddFriend(selectedMember.accId);
        } else if (modalAction === 'delete') {
            handleDeleteMember(selectedMember.accId);
        } else if (modalAction === 'changeRole') {
            handleChangeRole(selectedMember.accId);
        }
        setModalVisible(false);
    };

    const getModalText = () => {
        if (!selectedMember) return '';

        switch (modalAction) {
            case 'add':
                return friendRequests[selectedMember?.accId]
                    ? 'Do you want to cancel the friend request?'
                    : 'Do you want to send a friend request?';
            case 'remove':
                return 'Do you want to remove the friend request?';
            case 'delete':
                return 'Are you sure you want to remove this member?';
            case 'changeRole':
                return 'Do you want to grant role LEADER to this member?';
            default:
                return 'Are you sure you want to perform this action?';
        }
    };

    const handleLongPressMember = (member) => {
        setSelectedMember(member);
        setFooterModalVisible(true);
    };

    const handleViewProfile = () => {
        setFooterModalVisible(false);
        navigation.navigate('ProfileScreen', { userId: selectedMember.accId });
    };

    const handleAppointAsAdmin = () => {
        setFooterModalVisible(false);
        openModal(selectedMember, 'changeRole');
    };

    const handleBlockMember = () => {
        setFooterModalVisible(false);
        Alert.alert('Block Member', `Blocked ${selectedMember.name}`);
    };

    const handleRemoveFromGroup = () => {
        setFooterModalVisible(false);
        openModal(selectedMember, 'delete');
    };

    return (
        <View style={styles.container}>
            <SafeAreaProvider>
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.accId}
                    renderItem={({ item }) => (
                        <TouchableOpacity onLongPress={() => handleLongPressMember(item)} activeOpacity={0.7}>
                            <View style={styles.memberItem}>
                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                <View style={styles.memberInfo}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.role}>{item.role}</Text>
                                </View>
                                <View style={styles.actions}>
                                    {!item.isUser && item.action === 'add' && (
                                        <TouchableOpacity onPress={() => openModal(item, 'add')}>
                                            <Ionicons name="person-add-outline" size={24} color="blue" />
                                        </TouchableOpacity>
                                    )}
                                    {!item.isUser && item.action === 'remove' && (
                                        <TouchableOpacity onPress={() => openModal(item, 'remove')}>
                                            <Ionicons name="person-remove-outline" size={24} color="red" />
                                        </TouchableOpacity>
                                    )}

                                    {userRole === 'LEADER' && !item.isUser && (
                                        <TouchableOpacity onPress={() => openModal(item, 'changeRole')}>
                                            <Ionicons
                                                name="swap-horizontal-outline"
                                                size={24}
                                                color="green"
                                                style={[styles.changeRoleIcon, { paddingLeft: 10 }]}
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {members.some((m) => m.isUser && m.role === 'LEADER') && !item.isUser && (
                                        <TouchableOpacity onPress={() => openModal(item, 'delete')}>
                                            <Ionicons
                                                name="trash-outline"
                                                size={24}
                                                color="red"
                                                style={styles.deleteIcon}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                {/* Confirmation Modal */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{getModalText()}</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmAction} style={styles.confirmButton}>
                                    <Text style={styles.buttonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Footer Modal */}
                <Modal
                    visible={footerModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setFooterModalVisible(false)}
                >
                    <View style={styles.centeredModalContainer}>
                        <View style={styles.centeredModalContent}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderBottomWidth: 1,
                                    borderColor: '#f0f0f0',
                                    width: '100%',
                                    textAlign: 'center',
                                    paddingBottom: 15,
                                }}
                            >
                                Member Information
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setFooterModalVisible(false)} // Close modal on button press
                            >
                                <Text style={styles.closeButtonText}>
                                    <Ionicons name="close" size={26} color="black" />
                                </Text>
                            </TouchableOpacity>
                            {selectedMember && (
                                <View style={styles.modalHeader}>
                                    <Image source={{ uri: selectedMember.avatar }} style={styles.modalAvatar} />
                                    <Text style={styles.modalName}>{selectedMember.name}</Text>
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity style={styles.iconButton}>
                                            <Ionicons name="chatbubble-outline" size={20} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.iconButton, styles.callButton]}>
                                            <Ionicons name="call-outline" size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <TouchableOpacity style={styles.footerModalOption} onPress={handleViewProfile}>
                                <Text style={styles.footerModalText}>View Profile</Text>
                            </TouchableOpacity>
                            {userRole === 'LEADER' && (
                                <>
                                    <TouchableOpacity style={styles.footerModalOption} onPress={handleAppointAsAdmin}>
                                        <Text style={styles.footerModalText}>Appoint as Admin</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.footerModalOption} onPress={handleBlockMember}>
                                        <Text style={styles.footerModalText}>Block Member</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.footerModalOption} onPress={handleRemoveFromGroup}>
                                        <Text style={styles.footerModalText}>Remove from this Group</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </SafeAreaProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9', // Light background for a modern look
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10, // Rounded corners
        marginBottom: 5, // Spacing between items
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    memberInfo: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        color: '#333', // Darker text for better readability
    },
    role: {
        fontSize: 14,
        color: '#888', // Subtle color for secondary text
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIcon: {
        marginLeft: 15,
    },
    changeRoleIcon: {
        marginLeft: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay for better focus
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20, // Softer rounded corners
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6, // Enhanced shadow for Android
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#444', // Neutral text color
        fontWeight: '500',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    centeredModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Consistent overlay with other modals
    },
    centeredModalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    closeButton: {
        position: 'absolute',
        top: 17,
        right: 17,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        paddingVertical: 10,
    },
    modalAvatar: {
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    modalName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        flex: 1,
        marginLeft: 10,
    },
    modalActions: {
        flexDirection: 'row',
    },
    iconButton: {
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0', // Match cancel button background
        borderRadius: 100, // Match cancel button border radius
        alignItems: 'center',
        justifyContent: 'center',
    },
    callButton: {
        backgroundColor: '#f0f0f0', // Same as iconButton for consistency
    },
    footerModalOption: {
        paddingVertical: 15,
        marginTop: 0,
        width: '100%',
    },
    footerModalText: {
        fontSize: 16,
    },
    footerModalCancel: {
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    footerModalCancelText: {
        fontSize: 16,
        color: 'red',
        fontWeight: '500',
    },
});
