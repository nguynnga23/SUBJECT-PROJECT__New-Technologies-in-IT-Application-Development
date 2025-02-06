import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ContactScreen from "../../features/contact/screens/ContactScreen";
import ProfileScreen from "../../features/profile/screens/profileScreen";
import MessageStackNavigator from "../../features/message/components/MessageStackNavigator";

// Tạo Bottom Tabs
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "white", height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Messages") {
            iconName = "chatbubble-outline";
          } else if (route.name === "Contacts") {
            iconName = "people-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Messages" component={MessageStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Contacts" component={ContactScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
