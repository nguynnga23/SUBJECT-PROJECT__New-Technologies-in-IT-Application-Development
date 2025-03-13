import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { handleAddFriend, handleCancelAddFriend, handleDeleteMember } from "../../services/GroupChat/MemberListService";

const membersData = [
    { id: "1", name: "Huy Nguyen", role: "Leader", avatar: "https://example.com/avatar1.png", isUser: true },
    { id: "2", name: "Nguyen Nga", role: "member", avatar: "https://example.com/avatar2.png", isUser: false },
    { id: "3", name: "Nhiet Pham", role: "member", avatar: "https://example.com/avatar3.png", isUser: false },
    { id: "4", name: "Nguyen Thien Tu", role: "member", avatar: "https://example.com/avatar4.png", isUser: false },
];

export default function MemberListScreen() {
    const navigation = useNavigation();
    const [friendRequests, setFriendRequests] = useState({});
    const [selectedMember, setSelectedMember] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState("");
    const [members, setMembers] = useState(membersData);

    const openModal = (member, action) => {
        setSelectedMember(member);
        setModalAction(action);
        setModalVisible(true);
    };

    const confirmAction = () => {
        if (!selectedMember) return;

        if (modalAction === "add") {
            if (friendRequests[selectedMember.id]) {
                handleCancelAddFriend(selectedMember.id, setFriendRequests);
            } else {
                handleAddFriend(selectedMember.id, setFriendRequests);
            }
        } else if (modalAction === "delete") {
            handleDeleteMember(selectedMember.id, setMembers);
        }

        setModalVisible(false);
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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.memberItem}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.memberInfo}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>{item.role}</Text>
                            </View>
                            <View style={styles.actions}>
                                {!item.isUser && (
                                    <TouchableOpacity onPress={() => openModal(item, "add")}>
                                        <Ionicons
                                            name={friendRequests[item.id] ? "person-remove-outline" : "person-add-outline"}
                                            size={24}
                                            color={friendRequests[item.id] ? "red" : "blue"}
                                        />
                                    </TouchableOpacity>
                                )}

                                {members.some((m) => m.isUser && m.role === "Leader") && !item.isUser && (
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
                                {modalAction === "add"
                                    ? friendRequests[selectedMember?.id]
                                        ? "Do you want to cancel the friend request?"
                                        : "Do you want to send a friend request?"
                                    : "Are you sure you want to remove this member?"}
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
