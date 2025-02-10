import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageScreen from "../screens/MessageScreen";
import GroupChatScreen from "../screens/groupChat/GroupChatScreen";
import PrivateChatScreen from "../screens/privateChat/PrivateChatScreen";
import GroupCallScreen from "../screens/groupChat/GroupCallScreen";

const MessageStack = createNativeStackNavigator();

export default function MessageStackNavigator() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false }}>
      <MessageStack.Screen name="MessageScreen" component={MessageScreen} />
      <MessageStack.Screen
        name="GroupChatScreen"
        component={GroupChatScreen}
      />
      <MessageStack.Screen
        name="PrivateChatScreen"
        component={PrivateChatScreen}
        options={{ headerShown: true, title: "Chat riêng" }}
      />
      <MessageStack.Screen name="GroupCallScreen" component={GroupCallScreen} />
    </MessageStack.Navigator>
  );
}
