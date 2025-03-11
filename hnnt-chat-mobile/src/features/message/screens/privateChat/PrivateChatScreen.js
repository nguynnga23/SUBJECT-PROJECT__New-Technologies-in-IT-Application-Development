import React, { useState, useEffect } from "react";
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from "../../../../common/components/Header";

const chatData = {
  recipient_name: "Nga Nguyễn",
  messages: [
    { id: 201, sender: "me", message: "Chào Nga!", time: "18:55" },
    { id: 202, sender: "Nga Nguyễn", message: "Chào bạn!", time: "18:56" },
    { id: 203, sender: "me", message: "Bạn đã hoàn thành task chưa?", time: "18:57" },
    { id: 204, sender: "Nga Nguyễn", message: "Tôi đang làm, sắp xong rồi!", time: "19:00" },
  ],
};

export default function PrivateChatScreen() {
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
          <TouchableOpacity style={{ paddingRight: 20, paddingLeft: 10 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.recipientName}>{chatData.recipient_name}</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 70 }}
            onPress={() => navigation.navigate("PrivateCallScreen")}
          >
            <Icon name="video-outline" size={35} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', right: 10 }}
            onPress={() => navigation.navigate("PrivateChatInfoScreen", { recipientName: chatData.recipient_name })}
          >
            <Icon name="view-headline" size={35} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={chatData.messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.sender === "me" ? styles.myMessage : styles.otherMessage]}>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <Icon name="file" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="image" size={30} color="gray" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity>
            <Icon name="microphone" styles={{ paddingRight: 10 }} size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="send" size={30} color="#007AFF" />
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
    backgroundColor: '#005ae0',
  },

  recipientName: { fontSize: 18, fontWeight: "bold", color: "white" },

  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 5, maxWidth: "75%" },

  myMessage: { backgroundColor: "#aae7f3", alignSelf: "flex-end", marginRight: 10 },

  otherMessage: { backgroundColor: "white", alignSelf: "flex-start", marginLeft: 10 },

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
