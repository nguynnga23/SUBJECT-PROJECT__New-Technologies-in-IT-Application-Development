import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { addFriend, cancelAddFriend, deleteMember, fetchChat, changeRole, getListFriendRequest, checkFriend } from "../../services/GroupChat/MemberListService";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from "../../../../utils/auth";

export default function MemberListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const chatId = route.params?.chatId || "null";
    const [friendRequests, setFriendRequests] = useState({});
    const [hasFriendRequest, setHasFriendRequest] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState("");

    const [members, setMembers] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [myId, setMyId] = useState("");

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
            return "remove"; // Có yêu cầu kết bạn
        }

        return "add"; // Không có yêu cầu kết bạn
    };

    const handleCheckFriend = async (member, token) => {
        try {
            console.log("Checking friend status for member:", member.accountId, "My ID:", myId);
            if (member.accountId === myId) {
                console.log("This is the current user. Skipping check.");
                return; // Không kiểm tra trạng thái bạn bè cho chính mình
            }
            const response = await checkFriend(member.accountId, token);
            console.log("Friend check response:", response);
            return response.result; // Trả về true hoặc false tùy thuộc vào trạng thái bạn bè
        } catch (error) {
            console.warn("Error checking friend status:", error);
            return false; // Mặc định là không phải bạn bè nếu có lỗi
        }
    };

    const fetchChatInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const chatInfo = await fetchChat(chatId, token); // Replace with actual token
            const userId = getUserIdFromToken(token);
            setMyId(userId); // Lưu userId vào state
            const participant = chatInfo.participants.find(p => p.accountId === userId);
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
                        action: isUser || isFriend ? "none" : getMemberAction(member, friendRequestsData),
                    };
                })
            );
            //console log for each membersdata
            membersData.forEach((member) => {
                console.log("Member data:", member.name, member.isFriend, member.action);
            });
            setMembers(membersData);
        } catch (error) {
            console.warn("Error fetching chat info:", error);
        }
    };

    useEffect(() => {
        fetchChatInfo();
    }, [chatId]);

    const handleChangeRole = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await changeRole(chatId, accId, token);
            Alert.alert("Success", response.message);
            fetchChatInfo(); // Refresh the member list after changing role
        } catch (error) {
            console.warn("Error changing role:", error);
        }
    };

    const handleDeleteMember = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await deleteMember(chatId, accId, token);
            Alert.alert("Success", response.message);
            fetchChatInfo(); // Refresh the member list after deleting member
        } catch (error) {
            console.warn("Error deleting member:", error);
        }
    };

    const handleAddFriend = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await addFriend(accId, token);
            Alert.alert("Success", "success");
            fetchChatInfo();
        } catch (error) {
            console.warn("Error adding friend:", error);
        }
    };

    const handleCancelAddFriend = async (accId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const respone = await cancelAddFriend(accId, token);
            Alert.alert("Success", respone.message);
            fetchChatInfo(); // Refresh the member list after canceling friend request
        } catch (error) {
            console.warn("Error canceling friend request:", error);
        }
    };

    const confirmAction = () => {
        if (!selectedMember) return;

        if (modalAction === "add") {
            handleAddFriend(selectedMember.accId);
        } else if (modalAction === "remove") {
            handleCancelAddFriend(selectedMember.accId);
        } else if (modalAction === "delete") {
            handleDeleteMember(selectedMember.accId);
        } else if (modalAction === "changeRole") {
            handleChangeRole(selectedMember.accId);
        }
        setModalVisible(false);
    };

    const getModalText = () => {
        if (!selectedMember) return "";

        switch (modalAction) {
            case "add":
                return friendRequests[selectedMember?.accId]
                    ? "Do you want to cancel the friend request?"
                    : "Do you want to send a friend request?";
            case "remove":
                return "Do you want to remove the friend request?";
            case "delete":
                return "Are you sure you want to remove this member?";
            case "changeRole":
                return "Do you want to grant role LEADER to this member?";
            default:
                return "Are you sure you want to perform this action?";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Member List</Text>
                </View>

                <FlatList
                    data={members}
                    keyExtractor={(item) => item.accId}
                    renderItem={({ item }) => (
                        <View style={styles.memberItem}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.memberInfo}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>{item.role}</Text>
                            </View>
                            <View style={styles.actions}>
                                {!item.isUser && item.action === "add" && (
                                    <TouchableOpacity onPress={() => openModal(item, "add")}>
                                        <Ionicons name="person-add-outline" size={24} color="blue" />
                                    </TouchableOpacity>
                                )}
                                {!item.isUser && item.action === "remove" && (
                                    <TouchableOpacity onPress={() => openModal(item, "remove")}>
                                        <Ionicons name="person-remove-outline" size={24} color="red" />
                                    </TouchableOpacity>
                                )}

                                {userRole === "LEADER" && !item.isUser && (
                                    <TouchableOpacity onPress={() => openModal(item, "changeRole")}>
                                        <Ionicons name="swap-horizontal-outline" size={24} color="green" style={[styles.changeRoleIcon, { paddingLeft: 10 }]} />
                                    </TouchableOpacity>
                                )}

                                {members.some((m) => m.isUser && m.role === "LEADER") && !item.isUser && (
                                    <TouchableOpacity onPress={() => openModal(item, "delete")}>
                                        <Ionicons name="trash-outline" size={24} color="red" style={styles.deleteIcon} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                />

                {/* Confirmation Modal */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                {getModalText()}
                            </Text>
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
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        backgroundColor: "#005ae0",
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    memberItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    memberInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    role: {
        fontSize: 14,
        color: "gray",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteIcon: {
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: "gray",
        borderRadius: 5,
        alignItems: "center",
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
        padding: 10,
        backgroundColor: "blue",
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
