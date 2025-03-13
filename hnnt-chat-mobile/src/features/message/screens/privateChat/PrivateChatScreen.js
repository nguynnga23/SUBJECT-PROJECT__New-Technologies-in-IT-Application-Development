import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Header from "../../../../common/components/Header";
import {
  handleSendMessage, handleDeleteMessage,
  sendVoiceMessage, handleReaction, handleLongPressMessage
} from "../../services/privateChat/PrivateChatService";

const chatData = {
  recipient_name: "Nga Nguyễn",
  messages: [
    { id: 201, sender: "@nhietpham", name: "Nhiệt Phạm", message: "Chào Nga!", time: "18:55", isMe: true },
    { id: 202, sender: "@nganguyen", name: "Nga Nguyễn", message: "Chào bạn!", time: "18:56" },
    { id: 203, sender: "@nhietpham", name: "Nhiệt Phạm", message: "Bạn đã hoàn thành task chưa?", time: "18:57", isMe: true },
    { id: 204, sender: "@nganguten", name: "Nga Nguyễn", message: "Tôi đang làm, sắp xong rồi!", time: "19:00" },
  ],
  reaction: [
    { id: 1, reaction: "❤️", messageId: 204, userId: "@nhietpham", sum: 1 },
  ]
};

export default function PrivateChatScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chatData.messages);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecordVisible, setModalRecordVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [recordingSaved, setRecordingSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const reactionsList = ["❤️", "😂", "👍", "😮", "😢"];
  const [reactVisible, setReactVisible] = useState(false);
  const [messageId, setMessageId] = useState(null);

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

  const messagesWithReactions = chatData.messages.map((message) => {
    const reactions = chatData.reaction
      .filter((reaction) => reaction.messageId === parseInt(message.id)) // Lọc các reaction thuộc về message này
      .reduce((acc, reaction) => {
        acc[reaction.reaction] = (acc[reaction.reaction] || 0) + reaction.sum; // Gom nhóm reaction
        return acc;
      }, {});

    return { ...message, reactions };
  });

  const sendMessage = (text) => {
    handleSendMessage(text, messages, setMessages, replyingMessage, setReplyingMessage);
    Keyboard.dismiss();
  };

  const deleteMessage = (messageId) => {
    handleDeleteMessage(messageId, messages, setMessages);
  };

  const sendVoice = async () => {
    await sendVoiceMessage(recordingUri, setIsRecording, setRecordingUri, setRecordingSaved, messages, setMessages);
  };

  function showReactionOptions(messageId) {
    setSelectedMessage(messageId);
    setReactVisible(true);
  }

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
          data={messagesWithReactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleLongPressMessage(item.id, messages, setMessages, setReplyingMessage, setModalVisible)}>
              <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
                {/* Nội dung tin nhắn */}
                <Text style={styles.message}>{item.message}</Text>

                {/* Hiển thị reaction và thời gian */}
                <View style={styles.timeReactionContainer}>
                  <Text style={styles.time}>{item.time}</Text>

                  {/* Hiển thị reaction nếu có */}
                  {Object.keys(item.reactions).length > 0 && (
                    <View style={styles.reactionContainer}>
                      {Object.entries(item.reactions).map(([emoji, count]) => (
                        <TouchableOpacity onPress={() => deleteReaction(item.id, emoji)} key={emoji}>
                          <Text key={emoji} style={styles.reactionText}>
                            {emoji} {count}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Nút thả reaction */}
                <TouchableOpacity
                  onPress={() => { showReactionOptions(item.id); setMessageId(item.id) }}
                  style={{ position: "absolute", right: 5, bottom: 10 }}
                >
                  <FontAwesome name="smile-o" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },

  modalRecordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalRecordTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  recordingText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  fullImage: {
    width: "90%",
    height: "80%",
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "80%",
  },
  timeReactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Căn time và reaction về hai phía
    alignItems: "center",
    marginTop: 5,
  },

  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16
  },

  reactionText: {
    marginLeft: 5, // Tạo khoảng cách giữa các reaction
    fontSize: 14,
    color: "gray",
  },
});
