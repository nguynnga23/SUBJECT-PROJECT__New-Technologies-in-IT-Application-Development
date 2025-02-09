import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageScreen from "../screens/MessageScreen";
import GroupChatScreen from "../screens/GroupChatScreen";
import PrivateChatScreen from "../screens/PrivateChatScreen";
import CallScreen from "../screens/GroupCallScreen";

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
      <MessageStack.Screen name="CallScreen" component={CallScreen} />
    </MessageStack.Navigator>
  );
}
