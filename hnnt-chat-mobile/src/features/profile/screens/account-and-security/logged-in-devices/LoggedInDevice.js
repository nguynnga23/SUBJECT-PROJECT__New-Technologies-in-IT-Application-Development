import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const LoggedInDevice = () => {
    const currentDeviceId = '1'; // Example current device ID
    const devices = [
        { id: '1', name: 'iPhone 13', location: 'Tây Ninh', lastActive: '2023-03-01 10:00' },
        { id: '2', name: 'Samsung Galaxy S21', location: 'Ninh Bình', lastActive: '2023-03-02 15:30' },
        { id: '3', name: 'MacBook Pro', location: 'Tp. Hồ Chí Minh', lastActive: '2023-03-03 08:45' },
    ];

    const thisDevice = devices.find((device) => device.id === currentDeviceId);
    const otherDevices = devices.filter((device) => device.id !== currentDeviceId);

    const renderDevice = ({ item }) => (
        <View style={styles.deviceContainer}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceDetails}>Location: {item.location}</Text>
            <Text style={styles.deviceDetails}>Last Active: {item.lastActive}</Text>
            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {thisDevice && (
                <View>
                    <Text style={styles.sectionTitle}>This Device</Text>
                    <View style={styles.deviceContainer}>
                        <Text style={styles.deviceName}>{thisDevice.name}</Text>
                        <Text style={styles.deviceDetails}>Location: {thisDevice.location}</Text>
                        <Text style={styles.deviceDetails}>Last Active: {thisDevice.lastActive}</Text>
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
                    <TouchableOpacity style={styles.logoutAllButton}>
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
