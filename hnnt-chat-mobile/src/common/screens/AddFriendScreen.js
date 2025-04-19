import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Button,
    Image,
    ImageBackground,
} from 'react-native';
import React, { useRef, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import PhoneInput from 'react-native-phone-number-input';
import ProfileService from '../../features/profile/services/ProfileService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

const ActionItem = ({ title, onPress, iconName }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.customIcon}>
            <FontAwesome5 name={iconName} size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
);

export default function AddFriendScreen() {
    const navigation = useNavigation(); // Add navigation hook
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message
    const [userProfileLink, setUserProfileLink] = useState(''); // New state for user profile link
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [userName, setUserName] = useState(''); // State for user name
    const [userAvatar, setUserAvatar] = useState(''); // State for user avatar

    React.useEffect(() => {
        const fetchUserProfileLink = async () => {
            try {
                const currentUserData = await AsyncStorage.getItem('user');
                if (currentUserData) {
                    const currentUser = JSON.parse(currentUserData);
                    setUserProfileLink(`hnnt-chat://user/${currentUser.id}`); // Use a deep link format
                    setUserName(currentUser.name); // Set the user name
                    setUserAvatar(currentUser.avatar); // Set the user avatar
                }
            } catch (error) {
                console.error('Error fetching user profile link:', error);
            }
        };
        fetchUserProfileLink();
    }, []);

    const qrCodeContainerRef = useRef(null); // Ref for the container to capture

    const saveQRCodeToGallery = async () => {
        try {
            if (!qrCodeContainerRef.current) {
                alert('QR code is not ready yet.');
                return;
            }

            // Capture the QR code container as an image
            const uri = await captureRef(qrCodeContainerRef, {
                format: 'png',
                quality: 1,
            });

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                await MediaLibrary.createAssetAsync(uri);
                alert('QR code with user details saved to gallery!');
            } else {
                alert('Permission to access gallery is required.');
            }
        } catch (error) {
            console.error('Error saving QR code:', error);
            alert('Failed to save QR code.');
        }
    };

    const qrCodeRef = useRef(null); // Ref for QRCode component

    // Hàm xử lý từng ActionItem
    const handleScanQR = () => navigation.navigate('CameraScreen');
    const handlePhonebook = () => console.log('Open Phonebook');
    const handlePeopleYouMayKnow = () => console.log('View People You May Know');
    const handleSubmitPhoneNumber = async () => {
        try {
            setErrorMessage(''); // Clear any previous error message
            const token = await AsyncStorage.getItem('token');
            const currentUserData = await AsyncStorage.getItem('user'); // Retrieve current user data
            if (!token || !currentUserData) {
                console.error('Token or current user data not found');
                return;
            }

            const currentUser = JSON.parse(currentUserData); // Parse the current user data

            // Check if the entered phone number matches the logged-in user
            if (currentUser.number === phoneNumber || currentUser.email === phoneNumber) {
                setErrorMessage('You cannot add yourself as a friend.');
                return;
            }

            const user = await ProfileService.getUserByNumberOrEmail(token, {
                number: phoneNumber,
                email: '',
            });
            navigation.navigate('FriendProfileScreen', { user }); // Navigate to FriendProfileScreen with user data
        } catch (error) {
            if (error.message === 'User not found') {
                console.warn('No user found with the provided phone number.');
                setErrorMessage('No user found with the provided phone number.');
            } else {
                console.error('Error fetching user by phone number:', error);
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* QR Code Section */}
            <TouchableOpacity style={styles.userQRWrapper} onPress={() => setModalVisible(true)}>
                <View style={styles.userQR}>
                    {userProfileLink ? (
                        <View
                            style={{
                                borderRadius: 20,
                                overflow: 'hidden',
                                padding: 15,
                                backgroundColor: 'white', // hoặc bất kỳ màu nào bạn muốn
                            }}
                        >
                            <QRCode value={userProfileLink} size={120} />
                        </View>
                    ) : (
                        <Text>Loading QR Code...</Text>
                    )}
                    <Text style={styles.userQRText}>Quét mã để thêm bạn Zalo với tôi</Text>
                </View>
            </TouchableOpacity>

            {/* Modal for QR Code */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade" // Change animation type to fade
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Capture-only container */}
                        <View
                            ref={qrCodeContainerRef}
                            style={styles.captureContainer}
                            collapsable={false} // Ensure the view is capturable
                        >
                            <View style={styles.qrWrapper}>
                                {userAvatar && <Image source={{ uri: userAvatar }} style={styles.modalAvatar} />}
                                <Text style={styles.modalUserName}>{userName}</Text>
                                {userProfileLink && (
                                    <QRCode
                                        value={userProfileLink}
                                        size={150}
                                        backgroundColor="white" // Set background color
                                        getRef={(ref) => (qrCodeRef.current = ref)}
                                    />
                                )}
                            </View>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.button} onPress={saveQRCodeToGallery}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#FF3B30' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Phone Input Section */}
            <View style={styles.enterNumberPhoneWrapper}>
                <View style={styles.phoneInputWrapper}>
                    <View style={{ marginVertical: 10 }}>
                        <TextInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                borderRadius: 8,
                                width: 310,
                            }}
                        />
                    </View>
                    <TouchableOpacity style={styles.arrowRightButton} onPress={handleSubmitPhoneNumber}>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <ActionItem title="Scan QR code" iconName="qrcode" onPress={handleScanQR} />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionWrapper}>
                <ActionItem title="Phonebook" iconName="address-book" onPress={handlePhonebook} />
                <ActionItem title="People you may know" iconName="address-card" onPress={handlePeopleYouMayKnow} />
            </View>

            {/* View Friend Requests */}
            <View style={styles.viewSendRequestWrapper}>
                <Text style={{ textAlign: 'center' }}>View sent friend requests in Contacts</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    userQRWrapper: { flex: 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    userQR: {
        height: 250,
        width: 250,
        backgroundColor: '#476388',
        borderRadius: 20,
        alignItems: 'center',
        padding: 15,
        justifyContent: 'space-around',
    },
    userQRTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    userQRText: { color: '#fff' },
    enterNumberPhoneWrapper: {
        flex: 2,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 2,
        borderColor: '#F4F3F8',
    },
    arrowRightButton: {
        backgroundColor: '#DEE3E7',
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionWrapper: {
        flex: 2,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    customIcon: {
        width: 35,
        height: 35,
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: { textAlign: 'center' },
    viewSendRequestWrapper: { flex: 1, paddingHorizontal: 15 },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
    },
    modalContent: {
        width: 350,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15, // More rounded corners
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10, // Stronger shadow for better depth
    },
    modalAvatar: {
        width: 70,
        height: 70,
        borderRadius: 45, // Fully rounded avatar
        position: 'absolute',
        zIndex: 1,
        top: -25,
        borderWidth: 2,
        borderColor: '#fff',
    },
    modalUserName: {
        marginVertical: 10,
        fontSize: 16, // Slightly larger font size
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    qrWrapper: {
        padding: 20,
        backgroundColor: '#fff', // Softer background color
        borderRadius: 15,
        height: 300,
        width: 250,
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd', // Subtle border for the QR wrapper
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
        backgroundColor: '#f9f9f9', // Add background to button container
        padding: 10,
        borderRadius: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    captureContainer: {
        alignItems: 'center',
        backgroundColor: '#476388',
        width: 300,
        padding: 20,
        borderRadius: 15,
    },
});
