import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import FriendRequestScreen from '../../features/contact/screens/friends/friend-request/FriendRequestScreen';
import PhoneBookScreen from '../../features/contact/screens/friends/phonebook/PhoneBookScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import AddGroupScreen from '../screens/AddGroupScreen';
import SearchScreen from '../screens/SearchScreen';
import PhoneNumSignUpScreen from '../../features/auth/screens/PhoneNumSignUpScreen';
import OTPConfirmScreen from '../../features/auth/screens/OTPConfirmScreen';
import PasswordSignUpScreen from '../../features/auth/screens/PasswordSignUpScreen';
import HomeScreen from '../../features/auth/screens/HomeScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="HomeTab" component={BottomTabNavigator} options={{ headerShown: false }} />

                <Stack.Screen name="PhoneNumSignUp" component={PhoneNumSignUpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTPConfirm" component={OTPConfirmScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PasswordSignUp" component={PasswordSignUpScreen} options={{ headerShown: false }} />

                <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
                <Stack.Screen name="PhoneBook" component={PhoneBookScreen} />
                <Stack.Screen name="AddFriend" component={AddFriendScreen} />
                <Stack.Screen name="AddGroup" component={AddGroupScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
