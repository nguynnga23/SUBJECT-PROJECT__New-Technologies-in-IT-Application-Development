import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMember2Group, getListFriend, fetchChat } from "../../services/GroupChat/AddMembersService";

export default function AddMembersScreen() {
    const navigation = useNavigation();
    const [friends, setFriends] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchText, setSearchText] = useState('');
    const route = useRoute();
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

                // Lọc danh sách bạn bè: chỉ giữ những người chưa phải là thành viên nhóm
                const updatedFriends = friendsData.filter((friend) => !members.includes(friend.id));

                setFriends(updatedFriends);
                setFilteredFriends(updatedFriends); // Khởi tạo danh sách bạn bè được filter
            } catch (error) {
                console.error("Error fetching friends or group members:", error);
            }
        };

        fetchFriendsAndMembers();
    }, [chatId]);

    // Xử lý tìm kiếm
    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = friends.filter((friend) =>
            friend.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredFriends(filtered);
    };

    // Xử lý chọn/bỏ chọn bạn bè
    const toggleSelection = (id) => {
        setSelectedFriends((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((friendId) => friendId !== id) : [...prevSelected, id]
        );
    };

    // Xử lý thêm thành viên vào nhóm
    const handleAddMembers = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const selectedMembers = selectedFriends.map((id) => friends.find((friend) => friend.id === id));

            for (const member of selectedMembers) {
                await addMember2Group(chatId, member.id, token);
            }

            Alert.alert("Success", "Selected members have been added to the group.");
            navigation.goBack();
        } catch (error) {
            console.error("Error adding members to group:", error);
            Alert.alert("Error", "Failed to add members to the group.");
        }
    };

    // Render từng bạn bè
    const renderFriendItem = ({ item }) => {
        const isSelected = selectedFriends.includes(item.id);

        return (
            <TouchableOpacity style={styles.friendItem} onPress={() => toggleSelection(item.id)}>
                <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={24}
                    color={isSelected ? "#4a90e2" : "gray"}
                />
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.friendName}>{item.name}</Text>
            </TouchableOpacity>
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

                {/* Tìm kiếm */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={26} color="gray" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm bạn bè"
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                    </View>
                </View>

                {/* Danh sách bạn bè */}
                <FlatList
                    data={filteredFriends}
                    keyExtractor={(item) => item.id}
                    renderItem={renderFriendItem}
                    contentContainerStyle={styles.listContainer}
                />

                {/* Nút thêm thành viên */}
                {selectedFriends.length > 0 && (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddMembers}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                )}
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    searchWrapper: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        marginTop: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    listContainer: {
        paddingHorizontal: 15,
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
        marginHorizontal: 10,
    },
    friendName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#4a90e2",
        padding: 15,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});