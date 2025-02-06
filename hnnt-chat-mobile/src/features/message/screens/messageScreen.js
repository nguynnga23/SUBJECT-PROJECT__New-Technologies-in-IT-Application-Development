import { View, Text, Button } from "react-native";

export default function MessageScreen({ navigation }) {
  console.log("Test reload");
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text>Message Screen</Text>
      
      <Button title="Nhóm Chat" onPress={() => navigation.navigate("GroupChatScreen")} />

      <View style={{ paddingTop: 50 }} >
        <Button title="Chat riêng" onPress={() => navigation.navigate("PrivateChatScreen")} />
      </View>
    </View>
  );
}
