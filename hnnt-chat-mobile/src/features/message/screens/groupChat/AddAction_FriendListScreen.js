import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Dữ liệu JSON giả
const dummyFriends = [
    { id: "1", name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "2", name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: "3", name: "Michael Johnson", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: "4", name: "Emily Davis", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

export default function AddMemberScreen() {
    const navigation = useNavigation();
    const [addedMembers, setAddedMembers] = useState([]);

    // Xử lý khi thêm hoặc hủy thêm bạn bè
    const handleToggleMember = (friend) => {
        if (addedMembers.some((m) => m.id === friend.id)) {
            // Nếu đã thêm, xóa khỏi danh sách
            setAddedMembers(addedMembers.filter((m) => m.id !== friend.id));
        } else {
            // Nếu chưa thêm, thêm vào danh sách
            setAddedMembers([...addedMembers, friend]);
        }
    };

    // Render từng bạn bè
    const renderFriendItem = ({ item }) => {
        const isAdded = addedMembers.some((m) => m.id === item.id);

        return (
            <View style={styles.friendItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.friendName}>{item.name}</Text>
                <TouchableOpacity
                    style={[styles.button, isAdded ? styles.addedButton : styles.addButton]}
                    onPress={() => handleToggleMember(item)}
                >
                    <AntDesign name={isAdded ? "checkcircle" : "pluscircleo"} size={20} color="white" />
                    <Text style={styles.buttonText}>{isAdded ? "Added" : "Add"}</Text>
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
                    data={dummyFriends}
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
