import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

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
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=20' }} style={styles.avatar} />

            {/* Thông tin cá nhân */}
            <InfoItem icon="account-circle-outline" title="Zalo name" value="Nguyễn Nga" />
            <InfoItem icon="calendar-outline" title="Birthday" value="23/09/2003" />
            <InfoItem icon="gender-male-female" title="Gender" value="Female" />

            {/* Edit Button */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                    navigation.navigate('Profile Information');
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
        paddingVertical: 5,
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
