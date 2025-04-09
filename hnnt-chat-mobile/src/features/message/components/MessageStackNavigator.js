import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageScreen from "../screens/MessageScreen";
import GroupChatScreen from "../screens/groupChat/GroupChatScreen";
import GroupCallScreen from "../screens/groupChat/GroupCallScreen";
import GroupInfoScreen from "../screens/groupChat/GroupInfoScreen";
import MemberListScreen from "../screens/groupChat/MemberListScreen";
import FindGrMessagesScreen from "../screens/groupChat/FindGrMessageScreen";
import PrivateChatScreen from "../screens/privateChat/PrivateChatScreen";
import PrivateCallScreen from "../screens/privateChat/PrivateCallScreen";
import PrivateChatInfoScreen from "../screens/privateChat/PrivateChatInfoScreen";
import FindPrMessagesScreen from "../screens/privateChat/FindPrMessageScreen";
import AddMembersScreen from "../screens/groupChat/AddMembersScreen";

const MessageStack = createNativeStackNavigator();

export default function MessageStackNavigator() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false }}>
      <MessageStack.Screen name="MessageScreen" component={MessageScreen} />

      <MessageStack.Screen name="GroupChatScreen" component={GroupChatScreen} />
      <MessageStack.Screen name="PrivateChatScreen" component={PrivateChatScreen} />
      <MessageStack.Screen name="GroupCallScreen" component={GroupCallScreen} />
      <MessageStack.Screen name="GroupInfoScreen" component={GroupInfoScreen} />
      <MessageStack.Screen name="MemberListScreen" component={MemberListScreen} />
      <MessageStack.Screen name="FindGrMessagesScreen" component={FindGrMessagesScreen} />
      <MessageStack.Screen name="AddMemberScreen" component={AddMembersScreen} />


      <MessageStack.Screen name="PrivateCallScreen" component={PrivateCallScreen} />
      <MessageStack.Screen name="PrivateChatInfoScreen" component={PrivateChatInfoScreen} />
      <MessageStack.Screen name="FindPrMessagesScreen" component={FindPrMessagesScreen} />
    </MessageStack.Navigator>
  );
}
