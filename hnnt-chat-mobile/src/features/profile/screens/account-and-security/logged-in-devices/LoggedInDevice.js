import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LoggedInDeviceService from '../../../services/LoggedInDeviceService';

const LoggedInDevice = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const fetchedDevices = await LoggedInDeviceService.getDevices();
                setDevices(fetchedDevices);
            } catch (error) {
                // Alert.alert('Error', 'Failed to fetch devices', error);
                console.warn('Failed to fetch devices:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDevices();
    }, []);

    const handleLogoutDevice = async (id) => {
        try {
            await LoggedInDeviceService.deleteDevice(id);
            setDevices((prevDevices) => prevDevices.filter((device) => device.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to log out device');
        }
    };

    const handleLogoutAllDevices = async () => {
        try {
            await LoggedInDeviceService.logoutOtherDevices();
            setDevices((prevDevices) => prevDevices.filter((device) => device.isCurrentDevice));
        } catch (error) {
            Alert.alert('Error', 'Failed to log out all devices');
        }
    };

    const currentDevice = devices.find((device) => !device.isCurrentDevice);
    const otherDevices = devices.filter((device) => !device.isCurrentDevice);

    const renderDevice = ({ item }) => (
        <View style={styles.deviceContainer}>
            <Text style={styles.deviceName}>{item.deviceName}</Text>
            <Text style={styles.deviceDetails}>Platform: {item.platform}</Text>
            <Text style={styles.deviceDetails}>Last Active: {item.lastActive}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogoutDevice(item.id)}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {currentDevice && (
                <View>
                    <Text style={styles.sectionTitle}>This Device</Text>
                    <View style={styles.deviceContainer}>
                        <Text style={styles.deviceName}>{currentDevice.deviceName}</Text>
                        <Text style={styles.deviceDetails}>Platform: {currentDevice.platform}</Text>
                        <Text style={styles.deviceDetails}>Last Active: {currentDevice.lastActive}</Text>
                    </View>
                </View>
            )}
            {otherDevices.length > 0 && (
                <View>
                    <Text style={styles.sectionTitle}>Other Devices</Text>
                    <FlatList
                        data={otherDevices}
                        keyExtractor={(item) => item.id}
                        renderItem={renderDevice}
                        contentContainerStyle={styles.list}
                    />
                    <TouchableOpacity style={styles.logoutAllButton} onPress={handleLogoutAllDevices}>
                        <Text style={styles.logoutAllButtonText}>Log Out All Devices</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Softer background color
        padding: 16,
    },
    title: {
        fontSize: 18, // Slightly smaller font size
        fontWeight: '600', // Medium weight for a cleaner look
        marginBottom: 12,
        color: '#333', // Darker text for better contrast
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 8,
        color: '#444',
    },
    list: {
        paddingBottom: 12,
    },
    deviceContainer: {
        backgroundColor: '#fff',
        padding: 12, // Reduced padding
        borderRadius: 6, // Slightly smaller border radius
        marginBottom: 10,
        borderWidth: 1, // Border instead of shadow
        borderColor: '#ddd',
    },
    deviceName: {
        fontSize: 15, // Slightly smaller font size
        fontWeight: '600',
        marginBottom: 2,
        color: '#222', // Darker text
    },
    deviceDetails: {
        fontSize: 13, // Smaller font size for details
        color: '#666', // Softer text color
        marginBottom: 6,
    },
    logoutButton: {
        backgroundColor: '#FF6F61', // Softer button color
        paddingVertical: 6, // Reduced padding
        borderRadius: 4,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 13, // Smaller font size
        fontWeight: '600',
    },
    logoutAllButton: {
        backgroundColor: '#FF3B30', // Distinctive color for "Log Out All" button
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutAllButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LoggedInDevice;
