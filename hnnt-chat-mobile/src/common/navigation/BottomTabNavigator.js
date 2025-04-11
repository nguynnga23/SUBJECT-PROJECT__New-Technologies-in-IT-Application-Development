import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import ContactScreen from '../../features/contact/screens/ContactScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';
import MessageStackNavigator from '../../features/message/components/MessageStackNavigator';
import Header from '../components/Header';

// Tạo Bottom Tabs
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const navigation = useNavigation();

    const contactHandlePress = () => {
        navigation.navigate('Add Friends');
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerBackground: () => (
                    <LinearGradient
                        colors={['#0087FD', '#00ACF4']} // Gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }} // Horizontal gradient
                        style={{ flex: 1 }}
                    />
                ),
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
            <Tab.Screen
                name="Messages"
                component={MessageStackNavigator}
                options={{
                    headerTitle: () => <Header iconName1="qrcode-scan" iconName2="plus" showMenu={true} />,
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactScreen}
                options={{
                    headerTitle: () => <Header iconName2="adduser" onPress2={contactHandlePress} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerTitle: () => <Header iconName2="setting" />,
                }}
            />
        </Tab.Navigator>
    );
}
