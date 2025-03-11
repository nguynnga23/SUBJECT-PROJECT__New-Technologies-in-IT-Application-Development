import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet, Modal, TextInput, Button, Alert } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { handleReport, handleLeaveGroup, toggleMute, handleEditGroupName, handleChangeAvatar } from "../../services/GroupInfoService";

export default function GroupInfoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const groupName = route.params?.groupName || "null";
    const [isMuted, setIsMuted] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [reportVisible, setReportVisible] = useState(false);
    const [leaveVisible, setLeaveVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [avatar, setAvatar] = useState(null);

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

                        // source={require("../../../../assets/icon.png")}
                        source={{ uri: avatar }}
                        style={styles.groupImage}
                    />}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.groupName}>{newGroupName.trim() ? newGroupName : groupName}</Text>
                        <TouchableOpacity onPress={() => setEditVisible(true)}>
                            <AntDesign style={{ marginTop: 7 }} name="edit" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate("FindGrMessagesScreen")}>
                        <ActionButton icon="search" label="Find      message" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleChangeAvatar(setAvatar)}>
                        <ActionButton icon="image" label="Change avatar" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => toggleMute(isMuted, setIsMuted)}>
                        <Ionicons name={isMuted ? "notifications" : "notifications-off"} size={24} color="black" />
                        <Text style={styles.actionText}>{isMuted ? "Unmute" : "Mute"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Other Options */}
                <TouchableOpacity>
                    <OptionItem label="Image, file, link" />
                </TouchableOpacity>

                {/* <TouchableOpacity>
                    <OptionItem label="Pinned message" />
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => navigation.navigate("MemberListScreen")}>
                    <OptionItem label="Member (4)" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <OptionItem label="Add member" />
                </TouchableOpacity>

                {/* Group Links */}
                <OptionItem
                    label="Link to join group" s
                    textColor="black"
                    links={[
                        { text: "https://zalo.me/g/deuqlw127", url: "https://zalo.me/g/deuqlw127" },
                    ]}
                />

                {/* Danger Zone */}
                <TouchableOpacity onPress={() => setReportVisible(true)}>
                    <OptionItem label="Report" textColor="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLeaveVisible(true)}>
                    <OptionItem label="Leave group" textColor="red" />
                </TouchableOpacity>

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
                                <Button title="Apply" onPress={() => handleEditGroupName(setEditVisible, newGroupName, setNewGroupName)} />
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
                                <Button title="Leave" color="red" onPress={() => handleLeaveGroup(setLeaveVisible, navigation)} />
                            </View>
                        </View>
                    </View>
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
        backgroundColor: "#0084ff",
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

