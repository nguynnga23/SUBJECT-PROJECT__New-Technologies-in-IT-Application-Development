import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';



export default function ConfirmQRScreen() {
    const [isChecked, setIsChecked] = useState(true);

    const handleLogin = () => {
        // Xử lý đăng nhập
    };

    const handleReject = () => {
        // Xử lý từ chối
    };

    return (
        <View style={styles.container}>
            {/* <Image
                source={require('https://www.iconpacks.net/icons/4/free-laptop-error-icon-12463-thumb.png')} // thay bằng hình của bạn hoặc URI
                style={styles.image}
            /> */}
            <Text style={styles.title}>Đăng nhập Zalo Web bằng mã QR trên thiết bị lạ?</Text>
            <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                    Tài khoản có thể bị chiếm đoạt nếu đây không phải là thiết bị của bạn.{"\n"}
                    Bấm <Text style={styles.bold}>Từ chối</Text> nếu ai đó yêu cầu bạn đăng nhập bằng mã QR để bình chọn, trúng thưởng, nhận khuyến mãi,...
                </Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.infoText}><Text style={styles.label}>Trình duyệt:</Text> Microsoft Edge - Windows 10</Text>
                <Text style={styles.infoText}><Text style={styles.label}>Thời gian:</Text> 17:06 - 10/04/2025</Text>
                <Text style={styles.infoText}><Text style={styles.label}>Địa điểm:</Text> Hồ Chí Minh, Việt Nam</Text>
            </View>
            <View style={styles.checkboxContainer}>
                {/* <CheckBox
                    value={isChecked}
                    onValueChange={setIsChecked}
                /> */}
                <Text style={styles.checkboxLabel}>Tôi đã kiểm tra kỹ thông tin và xác nhận đây là thiết bị của tôi</Text>
            </View>
            <TouchableOpacity
                style={[styles.button, !isChecked && { backgroundColor: '#ccc' }]}
                onPress={handleLogin}
                disabled={!isChecked}
            >
                <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.rejectText}>Từ chối</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    warningBox: {
        backgroundColor: '#ffe6e6',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    warningText: {
        color: '#333',
        fontSize: 14,
    },
    bold: {
        fontWeight: 'bold',
        color: '#d00',
    },
    infoBox: {
        marginBottom: 20,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    rejectButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
    },
    rejectText: {
        color: '#333',
        fontWeight: 'bold',
    },
});
