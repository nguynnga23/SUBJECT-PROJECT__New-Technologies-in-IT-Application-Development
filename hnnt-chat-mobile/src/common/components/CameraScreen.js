import { CameraView, Camera } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { confirmQRLogin } from '../../features/auth/services/AuthService'; // Import hàm confirmQRLogin từ CameraService

export default function CameraScreen() {
    const [cameraPermission, setCameraPermission] = useState(); // State variable for camera permission
    const [scanned, setScanned] = useState(false);
    const [focusAnimation] = useState(new Animated.Value(1)); // Animation state for pulsing effect

    let cameraRef = useRef(); // Creates a ref object and assigns it to the variable cameraRef.
    const navigation = useNavigation();

    // When the screen is rendered initially, check if permission is granted to the app to access the Camera.
    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(cameraPermission.status === 'granted');
        })();
    }, []);

    useEffect(() => {
        // Start pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(focusAnimation, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(focusAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    // If permissions are not granted, app will have to wait for permissions
    if (cameraPermission === undefined) {
        return <Text>Request Permissions....</Text>;
    } else if (!cameraPermission) {
        return <Text>Permission for camera not granted. Please change this in settings</Text>;
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        if (!scanned) {
            setScanned(true);

            if (data.startsWith('hnnt-chat://user/')) {
                const userId = data.split('/').pop(); // Extract user ID
                console.log('Scanned User ID:', userId); // Log the scanned user ID
                navigation.navigate('FriendProfileScreen', { userId });
            } else if (data.startsWith('qr-login://')) {
                const token = data.replace('qr-login://', '');
                const userDataStr = await AsyncStorage.getItem('user');
                const userData = JSON.parse(userDataStr);
                await confirmQRLogin(token, userData?.id);
            } else {
                Alert.alert('Invalid QR Code', 'The scanned QR code is not recognized.');
            }

            setTimeout(() => setScanned(false), 3000); // Reset scanned state after 3 seconds
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'], // hoặc để trống để mặc định tất cả
                }}
                onBarcodeScanned={handleBarCodeScanned}
            >
                {/* Modern overlay with instructions */}
                <View style={styles.overlay}>
                    <Text style={styles.appName}>HNNT Chat</Text>
                    <Text style={styles.instructions}>Scan all QR codes</Text>
                    <Animated.View
                        style={[
                            styles.focusSquare,
                            { transform: [{ scale: focusAnimation }] }, // Apply pulsing animation
                        ]}
                    >
                        <View style={styles.cornerTopLeft} />
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                        <View style={styles.cornerBottomRight} />
                    </Animated.View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: -100,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Dark semi-transparent overlay
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        color: 'white',
        marginBottom: 60,
        textAlign: 'center',
    },
    focusSquare: {
        width: 200, // Adjust size as needed
        height: 200,
        position: 'relative',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 25,
        height: 25,
        borderTopWidth: 5,
        borderLeftWidth: 5,
        borderColor: '#fff',
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 25,
        height: 25,
        borderTopWidth: 5,
        borderRightWidth: 5,
        borderColor: '#fff',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 25,
        height: 25,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderColor: '#fff',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 25,
        height: 25,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderColor: '#fff',
    },
});
