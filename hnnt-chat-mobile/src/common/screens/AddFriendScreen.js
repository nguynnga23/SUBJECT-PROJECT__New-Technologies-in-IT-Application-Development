import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import PhoneInput from 'react-native-phone-number-input';

const ActionItem = ({ title, onPress, iconName }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.customIcon}>
            <FontAwesome5 name={iconName} size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
);

export default function AddFriendScreen() {
    const phoneInputRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [countryCode] = useState('VN'); // Mặc định Việt Nam

    // Hàm xử lý từng ActionItem
    const handleScanQR = () => console.log('Scan QR Code');
    const handlePhonebook = () => console.log('Open Phonebook');
    const handlePeopleYouMayKnow = () => console.log('View People You May Know');
    const handleSubmitPhoneNumber = () => {
        console.log('Số điện thoại nhập:', phoneNumber);
        console.log('Số điện thoại đã format:', formattedPhoneNumber);
    };

    return (
        <View style={styles.container}>
            {/* QR Code Section */}
            <View style={styles.userQRWrapper}>
                <View style={styles.userQR}>
                    <Text style={styles.userQRTitle}>Nguyễn Nga</Text>
                    <Text style={styles.userQRText}>Quét mã để thêm bạn Zalo với tôi</Text>
                </View>
            </View>

            {/* Phone Input Section */}
            <View style={styles.enterNumberPhoneWrapper}>
                <View style={styles.phoneInputWrapper}>
                    <View style={{ marginVertical: 10 }}>
                        <PhoneInput
                            ref={phoneInputRef}
                            defaultValue={phoneNumber}
                            defaultCode={countryCode}
                            layout="second"
                            onChangeText={(text) => setPhoneNumber(text)}
                            onChangeFormattedText={(text) => setFormattedPhoneNumber(text)}
                            withDarkTheme
                            withShadow
                        />
                    </View>
                    <TouchableOpacity style={styles.arrowRightButton} onPress={handleSubmitPhoneNumber}>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                </View>
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
    userQRWrapper: { flex: 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
    userQR: {
        height: 250,
        width: 250,
        backgroundColor: '#476388',
        borderRadius: 20,
        alignItems: 'center',
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
});
