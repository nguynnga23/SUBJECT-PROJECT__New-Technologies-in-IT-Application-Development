import { View, Text } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function GroupChatScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    // Ẩn BottomTab khi vào màn hình này
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      // Hiện lại BottomTab khi rời khỏi màn hình này
      navigation.getParent()?.setOptions({ tabBarStyle: { backgroundColor: "white", height: 60 } });
    };
  }, [navigation]);

  return (
    <View>
      <Text>Đây là nhóm chat</Text>
    </View>
  );
}
