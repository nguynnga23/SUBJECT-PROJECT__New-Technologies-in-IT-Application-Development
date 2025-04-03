import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet, Modal, TextInput, Button, Alert, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from "../../../../utils/auth";
import {
    handleReport, leaveGroup, toggleMute, editGroupName, handleChangeAvatar, disbandGroup,
    fetchChat, getPinMess, unPinMess
} from "../../services/GroupChat/GroupInfoService";

export default function GroupInfoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const chatId = route.params?.chatId || "null";
    const [isMuted, setIsMuted] = useState();
    const [editVisible, setEditVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [reportVisible, setReportVisible] = useState(false);
    const [leaveVisible, setLeaveVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [userRole, setUserRole] = useState("");
    const [disbandVisible, setDisbandVisible] = useState(false);
    const [pinVisible, setPinVisible] = useState(false);
    const [pinMess, setPinMess] = useState([]);
    const [messageId, setMessageId] = useState("");
    const [numberOfMembers, setNumberOfMembers] = useState("");

    const fetchChatInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const chatInfo = await fetchChat(chatId, token); // Replace with actual token
            setNewGroupName(chatInfo.name);
            setAvatar(chatInfo.avatar);
            const userId = getUserIdFromToken(token);
            const participant = chatInfo.participants.find(p => p.accountId === userId);
            if (participant) {
                setUserRole(participant.role); // Lưu vai trò vào state
                setIsMuted(participant.notify);
            }
            setNumberOfMembers("Member (" + chatInfo.participants.length + ")");

            try {
                const pin_Mess = await getPinMess(chatId, token);
                setPinMess(pin_Mess[0].content); // Lấy nội dung tin nhắn đầu tiên
                setMessageId(pin_Mess[0].id); // Lấy ID tin nhắn đầu tiên
            } catch (error) {
                if (error.response?.status === 404) {
                    // Xử lý lỗi 404 một cách yên lặng
                    console.warn("No pinned message found."); // Log cảnh báo nếu cần
                    setPinMess("No pinned message"); // Đặt giá trị mặc định
                    setMessageId(null); // Đặt giá trị mặc định
                } else {
                    // Xử lý các lỗi khác
                    console.warn("Error fetching pinned message:", error); // Log lỗi nếu cần
                    setPinMess(null); // Đặt giá trị mặc định nếu xảy ra lỗi khác
                    setMessageId(null); // Đặt giá trị mặc định nếu xảy ra lỗi khác
                }
            }

        } catch (error) {
            console.error("Error fetching chat info:", error);
        }
    };

    const handleEditGroupName = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await editGroupName(newGroupName, chatId, token);
            setNewGroupName(response.name);
            setEditVisible(false);
            fetchChatInfo();
            Alert.alert("Success", response.message);
        } catch (error) {
            console.warn("Error editing group name:", error);
        }
    }

    useEffect(() => {
        fetchChatInfo();
    }, [chatId]);

    const handleToggleMute = async () => {
        try {
            console.log("Toggling mute for chatId:", chatId);
            const token = await AsyncStorage.getItem('token');
            const response = await toggleMute(chatId, token);
            setIsMuted(response.notify);
            Alert.alert("Success", response.message);
        } catch (error) {
            console.error("Error toggling mute:", error);
        }
    };

    const handleUnPinMess = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await unPinMess(messageId, token);
            fetchChatInfo(); // Refresh chat info after unpinning
            Alert.alert("Success", response.message);
        } catch (error) {
            console.warn("Error unpinning message:", error);
        }
    };

    const handleDisbandGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await disbandGroup(chatId, token);
            Alert.alert("Success", response.message);
            navigation.reset({
                index: 0,
                routes: [{ name: "MessageScreen" }],
            });
        } catch (error) {
            console.warn("Error disbanding group:", error);
        }
    }

    const handleLeaveGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await leaveGroup(chatId, token);
            Alert.alert("Success", response.message);
            navigation.reset({
                index: 0,
                routes: [{ name: "MessageScreen" }],
            });
        } catch (error) {
            console.warn("Error leaving group:", error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Infomation</Text>
                </View>

                {/* Group Info */}
                <View style={styles.groupInfo}>
                    {avatar && <Image
                        source={{ uri: avatar || "https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg" }}
                        style={styles.groupImage}
                    />}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.groupName}>{newGroupName}</Text>
                        {userRole === "LEADER" && (<TouchableOpacity onPress={() => setEditVisible(true)}>
                            <AntDesign style={{ marginTop: 7 }} name="edit" size={24} color="black" />
                        </TouchableOpacity>)}
                    </View>

                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate("FindGrMessagesScreen")}>
                        <ActionButton icon="search" label="Find      message" />
                    </TouchableOpacity>

                    {userRole === "LEADER" && (
                        <TouchableOpacity onPress={() => handleChangeAvatar(setAvatar)}>
                            <ActionButton icon="image" label="Change avatar" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleMute()}>
                        <Ionicons name={isMuted ? "notifications" : "notifications-off"} size={24} color="black" />
                        <Text style={styles.actionText}>{isMuted ? "Unmute" : "Mute"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Other Options */}
                <TouchableOpacity>
                    <OptionItem label="Image, file, link" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPinVisible(true)}>
                    <OptionItem label="Pinned message" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("MemberListScreen", { chatId })}>
                    <OptionItem label={numberOfMembers} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("AddMemberScreen")}>
                    <OptionItem label="Add member" />
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
                <TouchableOpacity onPress={() => setReportVisible(true)}>
                    <OptionItem label="Report" textColor="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLeaveVisible(true)}>
                    <OptionItem label="Leave group" textColor="red" />
                </TouchableOpacity>
                {userRole === "LEADER" && (
                    <TouchableOpacity onPress={() => setDisbandVisible(true)}>
                        <OptionItem label="Disband group" textColor="red" />
                    </TouchableOpacity>
                )}

                {/* edit groupname modal */}
                <Modal visible={editVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Group Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newGroupName}
                                onChangeText={setNewGroupName}
                            />
                            <View style={styles.modalActions}>
                                <Button title="Cancel" color="red" onPress={() => setEditVisible(false)} />
                                <Button title="Apply" onPress={() => handleEditGroupName()} />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Report Modal */}
                <Modal visible={reportVisible} transparent animationType="slide">
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
                </Modal>

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
                <Modal visible={pinVisible} transparent animationType="slide">
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
                </Modal>
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

// Component tái sử dụng cho các nút chức năng
const ActionButton = ({ icon, label }) => (
    <View style={styles.actionButton}>
        <Ionicons name={icon} size={24} color="black" />
        <Text style={styles.actionText}>{label}</Text>
    </View>
);

// Component tái sử dụng cho danh sách tùy chọn
const OptionItem = ({ label, textColor = "black", links = [] }) => (
    <View style={styles.optionItem}>
        <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
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
        backgroundColor: "#f2f2f2",
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
    groupInfo: {
        alignItems: "center",
        padding: 15,
        backgroundColor: "white",
    },
    groupImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    groupName: {
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        backgroundColor: "white",
    },
    actionButton: {
        alignItems: "center",
    },
    actionText: {
        textAlign: "center",
        marginTop: 5,
        width: 70,
    },
    optionItem: {
        marginTop: 1,
        backgroundColor: "white",
        padding: 15,
    },
    optionText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    linkText: {
        fontSize: 14,
        marginTop: 5,
        textDecorationLine: "underline",
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginTop: 10,
        borderRadius: 5,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        width: "100%",
    },
});

