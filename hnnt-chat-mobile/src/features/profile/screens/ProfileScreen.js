import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.viewProfile} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#396AA5" />
        <Text style={styles.username}>{title}</Text>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.viewProfileWrapper}>
                <TouchableOpacity
                    style={styles.viewProfile}
                    onPress={() => {
                        navigation.navigate('Personal Information');
                    }}
                >
                    <Avatar.Image size={50} source={{ uri: 'https://i.pravatar.cc/150?img=20' }} />
                    <Text style={styles.username}>Nguyễn Nga</Text>
                    <MaterialCommunityIcons name="account-switch-outline" size={26} color="#396AA5" />
                </TouchableOpacity>
            </View>
            <View style={styles.actionWrapper}>
                <MenuItem
                    icon="security"
                    title="Account and security"
                    onPress={() => {
                        navigation.navigate('Account and security');
                    }}
                />
                <MenuItem
                    icon="lock-outline"
                    title="Private"
                    onPress={() => {
                        navigation.navigate('Privacy');
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewProfileWrapper: {
        marginBottom: 5,
    },
    viewProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 2,
    },
    username: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
});
