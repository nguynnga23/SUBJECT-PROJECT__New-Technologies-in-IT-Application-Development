import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const mockServerMessages = [
    { id: "101", sender: "@nganguyen92", name: "Nga Nguyễn", message: "Trello có đủ tài liệu nha!", time: "18:55" },
    { id: "102", sender: "@nganguyen92", name: "Nga Nguyễn", message: "Mn nhớ update task trên Trello nhé!", time: "18:56" },
    { id: "103", sender: "@huynh503", name: "Huy Nguyễn", message: "ok", time: "18:57" },
    { id: "104", sender: "@nhietpham", name: "Nhiệt Phạm", message: "yup", time: "19:00", isMe: true },
    { id: "105", sender: "@nguyenthientu413", name: "Tứ Nguyễn", message: "got it", time: "19:05" },
];

// Giả lập server trả về kết quả dựa trên từ khóa tìm kiếm
const fetchMessagesFromServer = (query) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (query.trim() === "") {
                resolve([]); // Nếu không nhập gì thì không trả về gì
            } else {
                const filtered = mockServerMessages.filter((msg) =>
                    msg.message.toLowerCase().includes(query.toLowerCase())
                );
                resolve(filtered);
            }
        }, 500); // Mô phỏng độ trễ server (500ms)
    });
};

export default function FindGrMessagesScreen() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

    const handleSearch = async () => {
        setLoading(true);
        const results = await fetchMessagesFromServer(searchQuery);
        setFilteredMessages(results);
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Find Messages</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter search query..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>

                {/* Message List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                ) : filteredMessages.length > 0 ? (
                    <FlatList
                        data={filteredMessages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.messageItem}>
                                <Text style={styles.sender}>{item.sender}</Text>
                                <Text style={styles.messageText}>{item.message}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : null}
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    searchButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    searchButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    messageItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    sender: {
        fontWeight: "bold",
        color: "#007AFF",
    },
    messageText: {
        color: "#333",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "gray",
        fontSize: 16,
    },
    noResults: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noResultsText: {
        color: "gray",
        fontSize: 16,
    },
});
