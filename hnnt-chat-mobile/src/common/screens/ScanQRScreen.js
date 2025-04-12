import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanQRScreen = () => {
    const navigation = useNavigation();

    const handleQRCodeRead = (e) => {
        const scannedData = e.data; // Extract scanned data
        if (scannedData.startsWith('hnnt-chat://user/')) {
            const userId = scannedData.split('/').pop(); // Extract user ID
            navigation.navigate('FriendProfileScreen', { userId }); // Navigate to FriendProfileScreen
        } else {
            alert('Invalid QR code');
        }
    };

    return (
        <View style={styles.container}>
            <QRCodeScanner onRead={handleQRCodeRead} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScanQRScreen;
