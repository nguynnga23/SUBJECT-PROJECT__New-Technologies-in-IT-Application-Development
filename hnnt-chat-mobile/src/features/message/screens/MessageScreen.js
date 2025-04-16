import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from "../../../utils/auth";
import { formatDateTime } from "../../../utils/formatDateTime";
import { fetchChats } from "../services/MessageChanelService"; // Import hàm fetchChats

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stateAvatar, setStateAvatar] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
      if (!token) {
        Alert.alert('Error', 'You are not logged in!');
        return;
      }
      const data = await fetchChats(token); // Gọi API để lấy danh sách chat
      setChats(data);
      setCurrentUser(await getUserIdFromToken(token));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch chats.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Dừng trạng thái làm mới
    }
  };

  useEffect(() => {
    loadChats();
  }, [chats]);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true); // Bắt đầu trạng thái làm mới
    loadChats(); // Gọi lại API để làm mới dữ liệu
  }, [chats]);

  const handlePress = (item, name) => {
    if (item.isGroup) {
      navigation.navigate("GroupChatScreen", { chatId: item.id, chatName: item.name });
    } else {
      navigation.navigate("PrivateChatScreen", { chatId: item.id, chatName: name, avatarUri: stateAvatar });
    }
  };

  const sortedData = chats.slice().sort((a, b) => {
    const timeA = a.messages?.[0]?.time ? new Date(a.messages[0].time).getTime() : 0;
    const timeB = b.messages?.[0]?.time ? new Date(b.messages[0].time).getTime() : 0;
    return timeB - timeA; // giảm dần
  });

  const renderItem = ({ item }) => {
    let avatar = item.avatar;
    let name = item.name;

    if (!item.isGroup) {
      const otherParticipant = item.participants.find(
        (p) => p.account.id !== currentUser
      );
      if (otherParticipant) {
        avatar = otherParticipant.account.avatar;
        setStateAvatar(avatar);
        name = otherParticipant.account.name;
      }
    }

    const lastMessage = item.messages?.[0];

    let content = "No messages yet";

    if (lastMessage) {
      const isMine = lastMessage.senderId === currentUser;

      const isDestroyed = lastMessage.destroy === true;
      const isDeleted =
        Array.isArray(lastMessage.deletedBy) &&
        lastMessage.deletedBy.includes(currentUser);

      if (isDestroyed || isDeleted) {
        content = "This message has been deleted or recalled";
      } else {
        let rawContent = "";

        if (lastMessage.type === "file" || lastMessage.type === "image") {
          rawContent = lastMessage.fileName || "[File]";
        } else {
          rawContent = lastMessage.content || "";
          if (rawContent.length > 30) {
            rawContent = rawContent.slice(0, 30) + "...";
          }
        }

        content = isMine ? `Me: ${rawContent}` : rawContent;
      }
    }

    return (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item, name)}>
        <Image
          source={{
            uri:
              avatar ||
              "https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>
              {lastMessage?.time ? formatDateTime(lastMessage.time) : ""}
            </Text>
          </View>
          <Text style={styles.message}>{content}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        data={sortedData}
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