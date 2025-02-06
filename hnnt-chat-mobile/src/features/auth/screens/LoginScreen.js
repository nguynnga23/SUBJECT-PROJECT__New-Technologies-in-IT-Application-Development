import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("HomeTab")} />
    </View>
  );
}
