import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Friends from '../screens/friends/ListFriendsScreen';
import OA from '../screens/OA/OA';
import Groups from '../screens/groups/Groups';
import FriendRequestScreen from '../screens/friends/friend-request/FriendRequestScreen';
import PhoneBookScreen from '../screens/friends/phonebook/PhoneBookScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function MaterialTopTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Friends" component={Friends} />
            <Tab.Screen name="Groups" component={Groups} />
            {/* <Tab.Screen name="OA" component={OA} /> */}
        </Tab.Navigator>
    );
}
