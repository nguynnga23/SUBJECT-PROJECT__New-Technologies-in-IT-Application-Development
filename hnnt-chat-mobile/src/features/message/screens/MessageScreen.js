// import { View, Text, Button } from "react-native";

// export default function MessageScreen({ navigation }) {
//   console.log("Test reload");
//   return (
//     <View style={{ flex: 1, alignItems: "center" }}>
//       <Text>Message Screen</Text>

//       <Button title="Nhóm Chat" onPress={() => navigation.navigate("GroupChatScreen")} />

//       <View style={{ paddingTop: 50 }} >
//         <Button title="Chat riêng" onPress={() => navigation.navigate("PrivateChatScreen")} />
//       </View>
//     </View>
//   );
// }

import React from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const messages = [
  { id: 1, name: "Media Box", message: "Báo Mới: Phá đường dây cá độ bóng đá...", time: "11 giờ", unread: true, typeChat: "private" },
  { id: 2, name: "Thời Tiết", message: "Chào ngày mới, thời tiết Thành phố Hồ Chí...", time: "11 giờ", unread: false, typeChat: "private" },
  { id: 3, name: "Nhóm CNMOI-HK2-24-25", message: "Nguyễn Nga: ChatGPT làm 😂", time: "18 giờ", unread: false, typeChat: "group" },
  { id: 4, name: "CNMOI-Hk2-24-25-KTPM17C-sangT6", message: "Nguyễn Minh Đức: Thưa thầy, nhóm 12 xin bổ...", time: "CN", unread: false, typeChat: "group" },
  { id: 5, name: "Nhóm 5_QLDA", message: "Trần Anh Bảo khóa bình chọn: Chương 3", time: "CN", unread: false, typeChat: "group" },
  { id: 6, name: "Nhóm 6- Tư Tưởng Hồ Chí Minh", message: "Nguyễn Tuấn An: [Hình ảnh]", time: "CN", unread: false, typeChat: "group" },
  { id: 7, name: "Nguyễn Thế Lực", message: "Không biết có nghe thấy không", time: "T7", unread: false, typeChat: "private" },
  { id: 8, name: "Fiza", message: "🎁 VIB Financial Free: Sắm Tết thành thơi...", time: "T7", unread: true, typeChat: "private" },
  { id: 9, name: "DHKTPM17B", message: "Hoang Khanh: [File] Kế hoạch ngày hội việc làm...", time: "T6", unread: false, typeChat: "private" },
];

const ChatListScreen = () => {
  const navigation = useNavigation();

  const handlePress = (item) => {
    if (item.typeChat === "private") {
      navigation.navigate("PrivateChatScreen", { chatId: item.id, chatName: item.name });
    } else {
      navigation.navigate("GroupChatScreen", { chatId: item.id, chatName: item.name });
    }
  };

  const renderItem = ({ item }) => (

    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Image source={require("../../../assets/icon.png")} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={[styles.message, item.unread && styles.unread]}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={messages} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
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
  unread: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default ChatListScreen;
