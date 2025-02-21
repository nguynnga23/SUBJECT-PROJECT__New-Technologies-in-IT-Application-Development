import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';

export default function PhoneNumber() {
    const phoneInputRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [countryCode] = useState('VN'); // Mặc định Việt Nam

    const handleSubmitPhoneNumber = () => {
        console.log('Số điện thoại nhập:', phoneNumber);
        console.log('Số điện thoại đã format:', formattedPhoneNumber);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter new phone numbers</Text>
            <Text style={styles.subtitle}>
                You will receive OTP code via phone call or text message to new phone number
            </Text>

            <View style={styles.phoneInputContainer}>
                <PhoneInput
                    ref={phoneInputRef}
                    defaultValue={phoneNumber}
                    placeholder="Enter new phone number"
                    defaultCode={countryCode}
                    layout="first"
                    onChangeText={(text) => setPhoneNumber(text)}
                    onChangeFormattedText={(text) => setFormattedPhoneNumber(text)}
                    containerStyle={styles.phoneInput} // Đảm bảo 100% chiều rộng
                    textContainerStyle={styles.textContainer} // Chỉ có viền dưới
                    codeTextStyle={styles.codeText} // Đồng bộ màu cho mã quốc gia (+84)
                    flagButtonStyle={styles.flagButton} // Đồng bộ UI cho quốc kỳ
                    autoFocus
                />
            </View>

            <TouchableOpacity
                style={[styles.arrowRightButton, phoneNumber ? styles.activeButton : styles.disabledButton]}
                onPress={handleSubmitPhoneNumber}
                disabled={!phoneNumber} // Vô hiệu hóa nếu chưa nhập số
            >
                <Text style={phoneNumber ? styles.activeText : styles.disabledText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    subtitle: {
        color: 'gray',
        marginBottom: 15,
    },
    phoneInputContainer: {
        marginVertical: 10,
        alignItems: 'center',
        marginBottom: 25,
        width: '100%', // Đảm bảo bố cục không bị lệch
    },
    phoneInput: {
        width: '100%', // Chiều rộng 100%
    },
    textContainer: {
        backgroundColor: 'transparent', // Xóa nền trắng
        borderBottomWidth: 2, // Chỉ có viền dưới
        borderColor: '#007AFF', // Màu xanh nổi bật
        borderRadius: 0, // Xóa bo góc
        paddingVertical: 5, // Giữ khoảng cách hợp lý
    },

    flagButton: {
        backgroundColor: 'transparent', // Xóa nền xung quanh quốc kỳ
        borderBottomWidth: 0.3, // Viền dưới đồng bộ
        marginRight: 5,
        borderColor: 'gray',
        width: 55,
    },
    arrowRightButton: {
        height: 40,
        width: '50%',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    activeButton: {
        backgroundColor: '#007AFF', // Màu xanh khi nhập số
    },
    disabledButton: {
        backgroundColor: '#DEE3E7', // Màu xám khi chưa nhập số
    },
    activeText: {
        color: 'white',
    },
    disabledText: {
        color: 'gray',
    },
});
