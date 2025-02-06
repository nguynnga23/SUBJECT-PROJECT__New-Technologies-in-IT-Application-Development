import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageScreen from "../screens/messageScreen";
import GroupChatScreen from "../screens/groupChatScreen";
import PrivateChatScreen from "../screens/privateChatScreen";

const MessageStack = createNativeStackNavigator();

export default function MessageStackNavigator() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false }}>
      <MessageStack.Screen name="MessageScreen" component={MessageScreen} />
      <MessageStack.Screen
        name="GroupChatScreen"
        component={GroupChatScreen}
        options={{ headerShown: true, title: "Nhóm Chat" }}
      />
      <MessageStack.Screen
        name="PrivateChatScreen"
        component={PrivateChatScreen}
        options={{ headerShown: true, title: "Chat riêng" }}
      />
    </MessageStack.Navigator>
  );
}
