import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDateTime } from "../../../utils/formatDateTime";
import { fetchChats } from "../services/MessageChanelService"; // Import hàm fetchChats

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State cho tính năng làm mới

  const loadChats = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
      if (!token) {
        Alert.alert('Error', 'You are not logged in!');
        return;
      }
      const data = await fetchChats(token); // Gọi API để lấy danh sách chat
      setChats(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch chats.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Dừng trạng thái làm mới
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true); // Bắt đầu trạng thái làm mới
    loadChats(); // Gọi lại API để làm mới dữ liệu
  }, []);

  const handlePress = (item) => {
    if (item.isGroup) {
      navigation.navigate("GroupChatScreen", { chatId: item.id, chatName: item.name });
    } else {
      navigation.navigate("PrivateChatScreen", { chatId: item.id, chatName: item.name });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Image
        source={{ uri: item.avatar || "https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg" }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{formatDateTime(item.updatedAt)}</Text>
        </View>
        <Text style={styles.message}>
          {item.messages.length > 0 ? item.messages[0].content : "No messages yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        } // Thêm RefreshControl để hỗ trợ kéo để làm mới
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  item: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChatListScreen;