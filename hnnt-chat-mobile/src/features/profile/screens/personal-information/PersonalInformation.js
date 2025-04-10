import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns'; // Import thư viện date-fns
// Component hiển thị thông tin
const InfoItem = ({ icon, title, value }) => (
    <View style={styles.infoContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={icon} size={24} color="gray" />
            <Text style={styles.zaloName}>{title}</Text>
        </View>
        <Text style={styles.realName}>{value}</Text>
    </View>
);

export default function PersonalInformation() {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params || {}; // fallback nếu chưa có
    // Định dạng ngày sinh
    const formattedBirthDate = user?.birthDate
        ? format(new Date(user.birthDate), 'dd/MM/yyyy') // Định dạng mm/dd/yyyy
        : 'Chưa cập nhật';
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <Image source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=20' }} style={styles.avatar} />

            {/* Thông tin cá nhân */}
            <InfoItem icon="account-circle-outline" title="Zalo name" value={user?.name || 'Chưa cập nhật'} />
            <InfoItem icon="calendar-outline" title="Birthday" value={formattedBirthDate || 'Chưa cập nhật'} />
            <InfoItem icon="gender-male-female" title="Gender" value={user?.gender || 'Chưa cập nhật'} />

            {/* Edit Button */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                    navigation.navigate('Profile Information', { user }); // có thể truyền tiếp nếu cần
                }}
            >
                <MaterialCommunityIcons name="pencil" size={20} color="gray" />
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        alignSelf: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.4,
        borderColor: '#EDEDED',
    },
    zaloName: {
        color: 'gray',
        marginLeft: 8,
    },
    realName: {},
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EDEDED',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '100%',
        marginTop: 10,
    },
    editText: {
        fontWeight: 'bold',
        paddingLeft: 5,
        textAlign: 'center',
    },
});
