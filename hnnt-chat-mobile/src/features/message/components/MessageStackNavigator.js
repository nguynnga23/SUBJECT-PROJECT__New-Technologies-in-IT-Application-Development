import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageScreen from '../screens/MessageScreen';
import GroupChatScreen from '../screens/groupChat/GroupChatScreen';
import GroupCallScreen from '../screens/groupChat/GroupCallScreen';
import GroupInfoScreen from '../screens/groupChat/GroupInfoScreen';
import MemberListScreen from '../screens/groupChat/MemberListScreen';
import FindGrMessagesScreen from '../screens/groupChat/FindGrMessageScreen';
import PrivateChatScreen from '../screens/privateChat/PrivateChatScreen';
import PrivateCallScreen from '../screens/privateChat/PrivateCallScreen';
import PrivateChatInfoScreen from '../screens/privateChat/PrivateChatInfoScreen';
import FindPrMessagesScreen from '../screens/privateChat/FindPrMessageScreen';
import AddMembersScreen from '../screens/groupChat/AddMembersScreen';
import SharedChatHeader from './SharedChatHeader';
import FileStorage from './FileStorage';
const MessageStack = createNativeStackNavigator();

export default function MessageStackNavigator() {
    return (
        <MessageStack.Navigator screenOptions={{ headerShown: false }}>
            <MessageStack.Screen name="MessageScreen" component={MessageScreen} />
            <MessageStack.Screen
                name="GroupChatScreen"
                component={GroupChatScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => (
                        <SharedChatHeader
                            navigation={navigation}
                            chatName={route.params?.chatName}
                            chatId={route.params?.chatId}
                            actions={[
                                { icon: 'video', onPress: () => navigation.navigate('GroupCallScreen') },
                                { icon: 'search', onPress: () => navigation.navigate('FindGrMessagesScreen') },

                                {
                                    icon: 'info',
                                    onPress: () =>
                                        navigation.navigate('GroupInfoScreen', { chatId: route.params?.chatId }),
                                },
                            ]}
                        />
                    ),
                })}
            />
            <MessageStack.Screen
                name="PrivateChatScreen"
                component={PrivateChatScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => (
                        <SharedChatHeader
                            navigation={navigation}
                            chatName={route.params?.chatName}
                            chatId={route.params?.chatId}
                            avatarUri={route.params?.avatar}
                            actions={[
                                { icon: 'phone', onPress: () => navigation.navigate('PrivateVoiceCallScreen') },
                                { icon: 'video', onPress: () => navigation.navigate('PrivateCallScreen') },
                                {
                                    icon: 'info',
                                    onPress: () =>
                                        navigation.navigate('PrivateChatInfoScreen', { chatId: route.params?.chatId, chatName: route.params?.chatName, avatar: route.params?.avatarUri }),
                                },
                            ]}
                        />
                    ),
                })}
            />
            <MessageStack.Screen name="GroupCallScreen" component={GroupCallScreen} />
            <MessageStack.Screen
                name="GroupInfoScreen"
                component={GroupInfoScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => <SharedChatHeader navigation={navigation} chatName="Information" actions={[]} />,
                })}
            />
            <MessageStack.Screen
                name="MemberListScreen"
                component={MemberListScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => (
                        <SharedChatHeader navigation={navigation} chatName="Member management" actions={[]} />
                    ),
                })}
            />
            <MessageStack.Screen name="FindGrMessagesScreen" component={FindGrMessagesScreen} />
            <MessageStack.Screen
                name="AddMemberScreen"
                component={AddMembersScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => (
                        <SharedChatHeader navigation={navigation} chatName="Add friends to group" actions={[]} />
                    ),
                })}
            />

            <MessageStack.Screen name="PrivateCallScreen" component={PrivateCallScreen} />
            <MessageStack.Screen
                name="FileStorage"
                component={FileStorage}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => (
                        <SharedChatHeader navigation={navigation} chatName="Media, files, links" actions={[]} />
                    ),
                })}
            />
            <MessageStack.Screen
                name="PrivateChatInfoScreen"
                component={PrivateChatInfoScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => <SharedChatHeader navigation={navigation} chatName="Information" actions={[]} />,
                })}
            />
            <MessageStack.Screen
                name="FindPrMessagesScreen"
                component={FindPrMessagesScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    header: () => <SharedChatHeader navigation={navigation} chatName="Search messangs" actions={[]} />,
                })}
            />
        </MessageStack.Navigator>
    );
}
