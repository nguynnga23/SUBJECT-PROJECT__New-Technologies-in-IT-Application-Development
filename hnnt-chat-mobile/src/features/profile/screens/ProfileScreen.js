import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../auth/services/AuthService';
import ProfileService from '../services/ProfileService';
import { fetchUserData } from '../utils/fetchUserData';

const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.viewProfile} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#396AA5" />
        <Text style={styles.username}>{title}</Text>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                try {
                    const userData = await fetchUserData();
                    setUser(userData);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchUser();
        }, []),
    );

    const handleLogout = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            if (token) {
                                await logout(token); // Gọi API logout nếu có
                            }
                            await AsyncStorage.removeItem('user');
                            await AsyncStorage.removeItem('token');

                            // ❗ Dùng reset để tránh back lại màn login
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'HomeScreen' }],
                            });
                        } catch (error) {
                            console.error('Error during logout:', error);
                        }
                    },
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.viewProfileWrapper}>
                <TouchableOpacity
                    style={styles.viewProfile}
                    onPress={() => navigation.navigate('Personal Information', { user })}
                >
                    <Avatar.Image
                        size={50}
                        source={{
                            uri: user?.avatar || 'https://i.pravatar.cc/150?img=20',
                        }}
                    />
                    <Text style={styles.username}>{user?.name || 'Loading...'}</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialCommunityIcons name="logout" size={24} color="#396AA5" />
                    </TouchableOpacity>
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
    logoutButton: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
