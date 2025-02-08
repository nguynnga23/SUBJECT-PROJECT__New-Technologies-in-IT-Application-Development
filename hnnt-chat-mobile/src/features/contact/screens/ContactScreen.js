import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialTopTabNavigator from "../navigation/MaterialTopTabNavigator";
export default function ContactScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <MaterialTopTabNavigator />
    </GestureHandlerRootView>
  );
}
