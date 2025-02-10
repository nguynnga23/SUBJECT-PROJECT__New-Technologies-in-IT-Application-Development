import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../../common/components/Header";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const chatData = {
  group_name: "CNMOI-HK2-24-25",
  members: [
    { id: 1, name: "Nga Nguyễn", username: "@nganguyen92", avatar: "avatar1.png" },
    { id: 2, name: "Huy Nguyễn", username: "@huynh503", avatar: "avatar2.png" },
    { id: 3, name: "Nhiệt Phạm", username: "@nhietpham", avatar: "avatar3.png", isMe: true },
    { id: 4, name: "nguyenthientu413", username: "@nguyenthientu413", avatar: "avatar4.png" },
  ],
  messages: [
    { id: 101, sender: "@nganguyen92", name: "Nga Nguyễn", message: "Link figma, mindmap, excel,.. và theo dõi Task đều có trong Trello nhé mn", time: "18:55", reactions: { "❤️": 1 } },
    { id: 102, sender: "@nganguyen92", name: "Nga Nguyễn", message: "Mn làm Task nào thì kéo sang Doing, làm xong thì kéo sang Review rồi comment để mn trong team biết nhé", time: "18:56" },
    { id: 103, sender: "@huynh503", name: "Huy Nguyễn", message: "ok", time: "18:57" },
    { id: 104, sender: "@nhietpham", name: "Nhiệt Phạm", message: "yup", time: "19:00", reactions: { "😂": 1 }, isMe: true },
    { id: 105, sender: "@nguyenthientu413", name: "Tứ Nguyễn", message: "got it", time: "19:05" },
  ],
};

export default function GroupChatScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const parentNav = navigation.getParent();
    parentNav?.setOptions({ tabBarStyle: { display: "none" }, headerShown: false });
    return () => {
      parentNav?.setOptions({
        tabBarStyle: { backgroundColor: "white", height: 60 },
        headerShown: true,
        headerTitle: () => <Header iconName1="qrcode-scan" iconName2="plus" />,
      });
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.header}>
          <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>

          <Text style={styles.groupName}>
            {chatData.group_name}
          </Text>

          <TouchableOpacity style={{ position: 'absolute', right: 70 }}
            onPress={() => navigation.navigate("GroupCallScreen")}
          >
            <Icon name="video-outline" size={35} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', right: 10 }}
            onPress={() => navigation.navigate("GroupInfoScreen", { groupName: chatData.group_name })}
          >
            <Icon name="view-headline" size={35} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={chatData.messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
              <Text style={styles.sender}>{item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />

        {/* Input Chat */}
        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <Icon name="file" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="image" size={24} color="gray" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity>
            <Icon name="microphone" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },

  header: {
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1ba9ff',
  },

  groupName: { fontSize: 18, fontWeight: "bold" },

  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 5, maxWidth: "75%" },

  myMessage: { backgroundColor: "#aae7f3", alignSelf: "flex-end" },

  otherMessage: { backgroundColor: "white", alignSelf: "flex-start" },

  sender: { fontWeight: "bold", color: "#007AFF" },

  message: { fontSize: 16, marginVertical: 3 },

  time: { fontSize: 12, color: "gray", textAlign: "right" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    height: 40,
    marginHorizontal: 10,
  },
});
