import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const handleEditGroupName = (setEditVisible, newGroupName, setGroupName) => {
    console.log("Updating group name:", newGroupName);
    setGroupName(newGroupName);
    setEditVisible(false);
};

export const handleReport = (reportReason, setReportVisible) => {
    if (!reportReason) return;
    console.log("Report reason:", reportReason);
    setReportVisible(false);
};

export const handleLeaveGroup = (setLeaveVisible, navigation) => {
    console.log("User confirmed leaving group");
    setLeaveVisible(false);
    navigation.reset({
        index: 0,
        routes: [{ name: "MessageScreen" }],
    });
};

export const toggleMute = (isMuted, setIsMuted) => {
    setIsMuted(!isMuted);
};

export const handleChangeAvatar = async (setAvatar) => {
    console.log("📸 Bắt đầu xử lý đổi avatar...");

    // Kiểm tra quyền truy cập ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("📜 Quyền truy cập:", status);

    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos.');
        return;
    }

    // Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    console.log("📷 Kết quả chọn ảnh:", result);

    if (!result.canceled) {
        console.log("✅ Ảnh được chọn:", result.assets[0].uri);
        setAvatar(result.assets[0].uri);
    }
};

export const handleDisbandGroup = (setDisbandVisible, navigation) => {
    console.log("Group has been disbanded.");
    setDisbandVisible(false);
    navigation.reset({
        index: 0,
        routes: [{ name: "MessageScreen" }],
    });
};