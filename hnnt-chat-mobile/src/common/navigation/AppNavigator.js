import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import FriendRequestScreen from '../../features/contact/screens/friends/friend-request/FriendRequestScreen';
import PhoneBookScreen from '../../features/contact/screens/friends/phonebook/PhoneBookScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import AddGroupScreen from '../screens/AddGroupScreen';
import SearchScreen from '../screens/SearchScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="HomeTab" component={BottomTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
                <Stack.Screen name="PhoneBook" component={PhoneBookScreen} />
                <Stack.Screen name="AddFriend" component={AddFriendScreen} />
                <Stack.Screen name="AddGroup" component={AddGroupScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
