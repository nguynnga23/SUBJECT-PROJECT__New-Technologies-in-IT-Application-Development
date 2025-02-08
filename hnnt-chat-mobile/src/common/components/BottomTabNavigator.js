import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput } from 'react-native';
import ContactScreen from '../../features/contact/screens/ContactScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';
import MessageStackNavigator from '../../features/message/components/MessageStackNavigator';
import Header from './header/Header';

// Tạo Bottom Tabs
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerStyle: {
                    backgroundColor: '#005ae0',
                },
                headerTitle: '',
                tabBarStyle: { backgroundColor: 'white', height: 60 },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Messages') {
                        iconName = 'chatbubble-outline';
                    } else if (route.name === 'Contacts') {
                        iconName = 'people-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Messages" component={MessageStackNavigator} options={{ headerShown: false }} />
            <Tab.Screen
                name="Contacts"
                component={ContactScreen}
                options={{
                    headerLeft: () => <Header iconName="adduser" />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerLeft: () => <Header iconName="setting" />,
                }}
            />
        </Tab.Navigator>
    );
}
