import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet, Modal, TextInput, Button, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { handleBlock, handleReport, toggleMute } from "../../services/privateChat/PrivateChatInfoService";

export default function PrivateChatInfoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const recipientName = route.params?.recipientName || "null";
    const [isMuted, setIsMuted] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [blockVisible, setBlockVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [pinVisible, setPinVisible] = useState(false);

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

                <View style={styles.chatInfo}>
                    <Image
                        source={require("../../../../assets/icon.png")}
                        style={styles.avatar}
                    />
                    <Text style={styles.recipientName}>{recipientName}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate("FindPrMessagesScreen")}>
                        <ActionButton icon="search" label="Find messages" />
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
                <TouchableOpacity onPress={() => setPinVisible(true)}>
                    <OptionItem label="Pin messenge" />
                </TouchableOpacity>

                {/* Danger Zone */}
                <TouchableOpacity onPress={() => setReportVisible(true)}>
                    <OptionItem label="Report" textColor="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setBlockVisible(true)}>
                    <OptionItem label="Block user" textColor="red" />
                </TouchableOpacity>

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
                                <Button title="Submit" onPress={() => { handleReport(reportReason, setReportReason); setReportVisible(false) }} />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Block modal */}
                <Modal visible={blockVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Block user</Text>
                            <Text>Are you sure you want to block this user?</Text>
                            <View style={styles.modalActions}>
                                <Button title="Cancel" onPress={() => setBlockVisible(false)} />
                                <Button title="Yes" color="red" onPress={() => handleBlock(setBlockVisible, navigation)} />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Pin messenge modal */}
                <Modal visible={pinVisible} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setPinVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Pin messenge</Text>
                                <Text>...</Text>
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
    chatInfo: {
        alignItems: "center",
        padding: 15,
        backgroundColor: "white",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    recipientName: {
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

