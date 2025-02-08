import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../features/auth/screens/HomeScreen";
import LoginScreen from "../features/auth/screens/LoginScreen";
import PhoneNumSignUpScreen from "../features/auth/screens/PhoneNumSignUpScreen";
import OTPConfirmScreen from "../features/auth/screens/OTPConfirmScreen";
import PasswordSignUpScreen from "../features/auth/screens/PasswordSignUpScreen";
import BottomTabNavigator from "./components/BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PhoneNumSignUp" component={PhoneNumSignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="OTPConfirm" component={OTPConfirmScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PasswordSignUp" component={PasswordSignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeTab" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
