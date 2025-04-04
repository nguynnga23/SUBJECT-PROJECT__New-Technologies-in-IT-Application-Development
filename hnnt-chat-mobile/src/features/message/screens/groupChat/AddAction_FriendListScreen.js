import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMember2Group, getListFriend, fetchChat } from "../../services/GroupChat/AddFriendActionService";

export default function AddMemberScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [friends, setFriends] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const chatId = route.params?.chatId || "null";

    // Lấy danh sách bạn bè và thành viên nhóm
    useEffect(() => {
        const fetchFriendsAndMembers = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                // Lấy danh sách bạn bè
                const friendsData = await getListFriend(token);

                // Lấy danh sách thành viên nhóm
                const chatInfo = await fetchChat(chatId, token);
                const members = chatInfo.participants.map((member) => member.accountId);

                setGroupMembers(members);

                // Đánh dấu trạng thái `isAdded` cho từng bạn bè
                const updatedFriends = friendsData.map((friend) => ({
                    ...friend,
                    isAdded: members.includes(friend.id), // Kiểm tra nếu bạn bè đã có trong nhóm
                }));

                setFriends(updatedFriends);
            } catch (error) {
                console.error("Error fetching friends or group members:", error);
            }
        };

        fetchFriendsAndMembers();
    }, [chatId]);

    // Xử lý thêm thành viên vào nhóm
    const handleAddMember = async (friend) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await addMember2Group(chatId, friend.id, token);

            Alert.alert("Success", `${friend.name} has been added to the group.`);

            // Cập nhật trạng thái `isAdded` cho bạn bè
            setFriends((prevFriends) =>
                prevFriends.map((f) =>
                    f.id === friend.id ? { ...f, isAdded: true } : f
                )
            );
        } catch (error) {
            console.error("Error adding member to group:", error);
            Alert.alert("Error", "Failed to add member to the group.");
        }
    };

    // Render từng bạn bè
    const renderFriendItem = ({ item }) => {
        return (
            <View style={styles.friendItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.friendName}>{item.name}</Text>
                <TouchableOpacity
                    style={[styles.button, item.isAdded ? styles.addedButton : styles.addButton]}
                    onPress={() => !item.isAdded && handleAddMember(item)} // Chỉ thêm nếu chưa có trong nhóm
                    disabled={item.isAdded} // Vô hiệu hóa nút nếu đã có trong nhóm
                >
                    <AntDesign
                        name={item.isAdded ? "checkcircle" : "pluscircleo"}
                        size={20}
                        color="white"
                    />
                    <Text style={styles.buttonText}>
                        {item.isAdded ? "Added" : "Add"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Add Members</Text>
                </View>

                {/* Danh sách bạn bè */}
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={renderFriendItem}
                    contentContainerStyle={styles.listContainer}
                />
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#4a90e2",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginLeft: 10,
    },
    listContainer: {
        padding: 15,
    },
    friendItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    friendName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: "#4a90e2",
    },
    addedButton: {
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "bold",
    },
});