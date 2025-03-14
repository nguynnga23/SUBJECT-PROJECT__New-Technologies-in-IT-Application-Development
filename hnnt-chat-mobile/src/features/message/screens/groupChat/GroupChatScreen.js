import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../../common/components/Header";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import chatData, {
  handleLongPressMessage,
  handleDeleteMessage,
  handleSendMessage, sendImage, sendFile, downloadFile,
  startRecording, stopRecording, sendVoiceMessage, playAudio,
  handleReaction
} from "../../services/GroupChat/GroupChatService";

export default function GroupChatScreen() {
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
      });
    };
  }, [navigation]);

  const getReactionsForMessage = (messageId) => {
    return chatData.reaction
      .filter((reaction) => reaction.messageId.toString() === messageId.toString())
      .reduce((acc, curr) => {
        acc[curr.reaction] = (acc[curr.reaction] || 0) + curr.sum;
        return acc;
      }, {});
  };

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

  // function handleSelectReaction(emoji) {
  //   handleReaction(userId, emoji, messageId);
  //   setReactVisible(false);
  //   //Render lai man hinh
  // }

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaProvider>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={{ paddingRight: 20, paddingLeft: 10 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>

          <Text style={styles.groupName}>{chatData.group_name}</Text>

          <TouchableOpacity style={{ position: "absolute", right: 70 }} onPress={() => navigation.navigate("GroupCallScreen")}>
            <Icon name="video-outline" size={35} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => navigation.navigate("GroupInfoScreen", { groupName: chatData.group_name })}>
            <Icon name="view-headline" size={35} color="white" />
          </TouchableOpacity>
        </View>

        {/* Danh sách tin nhắn */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleLongPressMessage(item.id, messages, setMessages, setReplyingMessage, setModalVisible)}>
              <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>

                {item.replyTo && (
                  <View style={styles.replyBox}>
                    <Text style={styles.replyUser}>Replying to {item.replyTo.name}</Text>
                    <Text style={styles.replyMessage}>{item.replyTo.message}</Text>
                  </View>
                )}

                <Text style={styles.sender}>{item.name}</Text>

                {item.audioUri && (
                  <TouchableOpacity onPress={() => playAudio(item.audioUri)} style={styles.playButton}>
                    <Ionicons name="play-circle" size={30} color="blue" />
                  </TouchableOpacity>
                )}

                {item.image && (
                  <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
                    <Image source={{ uri: item.image }} style={{ width: 200, height: 200, borderRadius: 10 }} />
                  </TouchableOpacity>
                )}

                {item.fileUri && (
                  <TouchableOpacity onPress={() => downloadFile(item.fileUri, item.fileName)} style={styles.fileContainer}>
                    <Ionicons name="document-text-outline" size={24} color="blue" />
                    <Text style={styles.fileName}>{item.fileName} ({(item.fileSize / 1024).toFixed(2)} KB)</Text>
                  </TouchableOpacity>
                )}


                {/* Nội dung tin nhắn */}
                <Text style={styles.message}>{item.message}</Text>

                {/* Hiển thị reaction và thời gian */}
                <View style={styles.timeReactionContainer}>
                  <Text style={styles.time}>{item.time}</Text>

                  {Object.keys(getReactionsForMessage(item.id)).length > 0 && (
                    <View style={styles.reactionContainer}>
                      {Object.entries(getReactionsForMessage(item.id)).map(([emoji, count]) => (
                        <TouchableOpacity key={emoji} onPress={() => deleteReaction(item.id, emoji)}>
                          <Text style={styles.reactionText}>
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
                  style={{ position: "absolute", right: 5, bottom: 9 }}
                >
                  <FontAwesome name="smile-o" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Input Chat */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => sendFile(messages, setMessages)}>
            <Icon name="file" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sendImage(messages, setMessages)}>
            <Icon name="image" size={30} color="gray" />
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder="Enter message..." value={message} onChangeText={setMessage} />

          <TouchableOpacity onPress={() => setModalRecordVisible(true)}>
            <Icon name="microphone" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { sendMessage(message); setMessage(""); }}>
            <Icon name="send" size={30} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {replyingMessage && (
                  <View style={styles.replyBox}>
                    <Text style={styles.replyUser}>Replying to {replyingMessage.name}</Text>
                    <Text style={styles.replyMessage}>{replyingMessage.message}</Text>
                  </View>
                )}
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.inputAnswer}
                    placeholder="Enter message..."
                    value={message}
                    onChangeText={setMessage}
                  />
                  <TouchableOpacity onPress={() => { sendMessage(message); setMessage(""); setModalVisible(false); }}>
                    <Icon name="send" size={30} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal ghi âm */}
        <Modal animationType="slide" transparent={true} visible={modalRecordVisible}>
          <View style={styles.modalRecordContainer}>
            <Text style={styles.modalRecordTitle}>Voice Recorder</Text>

            {/* Trạng thái ghi âm */}
            {isRecording ? <Text style={styles.recordingText}>Recording...</Text> : null}

            <View style={styles.buttonContainer}>
              {/* Bắt đầu ghi âm */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => startRecording(setIsRecording)}
                disabled={isRecording}
              >
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>

              {/* Dừng ghi âm */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => stopRecording(setIsRecording, setRecordingUri, setRecordingSaved)}
                disabled={!isRecording}
              >
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>

              {/* Gửi tin nhắn ghi âm */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  sendVoice();
                  setModalRecordVisible(false);
                }}
                disabled={!recordingUri}
              >
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>

              {/* Hủy ghi âm */}
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalRecordVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal hiển thị ảnh lớn */}
        <Modal visible={!!selectedImage} transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => setSelectedImage(null)} // Đóng modal khi nhấn ra ngoài
          >
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          </TouchableOpacity>
        </Modal>

        {/* Modal hiển thị reaction */}
        <Modal visible={reactVisible} transparent={true} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setReactVisible(false)}>
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}>
              <View style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                flexDirection: "row",
              }}>
                {reactionsList.map((emoji) => (
                  <TouchableOpacity key={emoji} onPress={() => handleSelectReaction(emoji)}>
                    <Text style={{
                      fontSize: 20,
                      marginHorizontal: 10,
                    }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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

  groupName: { fontSize: 18, fontWeight: "bold", color: "white" },

  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 5, maxWidth: "75%", paddingRight: 30 },

  myMessage: { backgroundColor: "#aae7f3", alignSelf: "flex-end", marginRight: 10 },

  otherMessage: { backgroundColor: "white", alignSelf: "flex-start", marginLeft: 10 },

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
  replyBox: {
    width: "100%",
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 10,
  },
  replyUser: {
    fontWeight: "bold",
    color: "#333",
  },
  replyMessage: {
    color: "#555",
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },

  inputAnswer: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginRight: 10, // Thêm khoảng cách giữa ô input và nút gửi
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
  },

  reactionText: {
    marginLeft: 5, // Tạo khoảng cách giữa các reaction
    fontSize: 14,
    color: "gray",
  },
});
