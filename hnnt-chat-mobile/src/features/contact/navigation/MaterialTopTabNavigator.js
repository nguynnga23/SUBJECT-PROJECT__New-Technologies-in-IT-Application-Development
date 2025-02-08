import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Friends from '../screens/friends/Friends';
import OA from '../screens/OA/OA';
import Groups from '../screens/groups/Groups';
const Tab = createMaterialTopTabNavigator();
export default function MaterialTopTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Friends" component={Friends} />
            <Tab.Screen name="Groups" component={Groups} />
            <Tab.Screen name="OA" component={OA} />
        </Tab.Navigator>
    );
}
