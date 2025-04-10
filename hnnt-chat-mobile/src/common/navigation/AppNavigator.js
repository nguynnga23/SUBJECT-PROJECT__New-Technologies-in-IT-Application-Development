import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import FriendRequestScreen from '../../features/contact/screens/friends/friend-request/FriendRequestScreen';
import PhoneBookScreen from '../../features/contact/screens/friends/phonebook/PhoneBookScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import AddGroupScreen from '../screens/AddGroupScreen';
import SearchScreen from '../screens/SearchScreen';
import SignUpScreen from '../../features/auth/screens/register/SignUpScreen';
import OTPConfirmScreen from '../../features/auth/screens/register/OTPConfirmScreen';
import ResetPasswordScreen from '../../features/auth/screens/forgot/ResetPasswordScreen';
import HomeScreen from '../../features/auth/screens/HomeScreen';
import AccountAndSecurity from '../../features/profile/screens/account-and-security/AccountAndSecurity';
import Privacy from '../../features/profile/screens/privacy/Privacy';
import PersonalInformation from '../../features/profile/screens/personal-information/PersonalInformation';
import EditPersonalInformation from '../../features/profile/screens/personal-information/EditPersonalInformation';
import ForgotPasswordScreen from '../../features/auth/screens/forgot/ForgotPasswordScreen';
import Forgot_OTPConfirmScreen from '../../features/auth/screens/forgot/Forgot_OTPConfirmScreen';
import CameraScreen from '../components/CameraScreen';
import ComfirmLoginQR from '../components/ComfirmLoginQR';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="HomeTab" component={BottomTabNavigator} options={{ headerShown: false }} />

                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTPConfirm" component={OTPConfirmScreen} options={{ headerShown: false }} />

                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Forgot_OTPConfirm" component={Forgot_OTPConfirmScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />

                <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
                <Stack.Screen name="PhoneBook" component={PhoneBookScreen} />
                <Stack.Screen name="Add Friends" component={AddFriendScreen} />
                <Stack.Screen name="New Group" component={AddGroupScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />

                <Stack.Screen name="Account and security" component={AccountAndSecurity} />
                <Stack.Screen name="Privacy" component={Privacy} />
                <Stack.Screen name="Personal Information" component={PersonalInformation} />
                <Stack.Screen name="Profile Information" component={EditPersonalInformation} />

                <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ComfirmLoginQR" component={ComfirmLoginQR} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
