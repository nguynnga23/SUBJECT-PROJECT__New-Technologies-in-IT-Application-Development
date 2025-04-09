import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp, sendOtp } from '../../services/RegisterService';

export default function OTPConfirmScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params; // Lấy email từ route params
    const [otp, setOtp] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây

    // Kiểm tra nếu đã nhập đủ 6 số thì mới cho bấm Next
    const isButtonEnabled = otp.length === 6;

    useEffect(() => {
        // Bắt đầu đếm ngược khi render màn hình
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Dọn dẹp timer khi component bị unmount
    }, [countdown]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await verifyOtp(email, otp);
            if (response.success) {
                Alert.alert("Success", "OTP verified successfully! Now you can log in.");
                navigation.navigate('HomeScreen'); // Điều hướng đến HomeScreen
            } else {
                Alert.alert("Error", response.message || "Invalid OTP.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while verifying OTP.");
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return; // Không cho phép gửi lại nếu đang đếm ngược

        setIsResending(true);
        try {
            const response = await sendOtp(email);
            if (response.success) {
                Alert.alert("Success", "OTP has been resent to your email.");
                setCountdown(300); // Reset thời gian đếm ngược về 5 phút
            } else {
                Alert.alert("Error", response.message || "Failed to resend OTP.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while resending OTP.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Nút quay lại */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.title}>Enter OTP</Text>

                    {/* Ô nhập mã OTP */}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="numeric"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                    />

                    {/* Hiển thị thời gian đếm ngược */}
                    <Text style={styles.countdownText}>
                        Resend available in: {formatTime(countdown)}
                    </Text>

                    {/* Nút Gửi lại OTP */}
                    <TouchableOpacity
                        onPress={handleResendOtp}
                        style={styles.resendButton}
                        disabled={countdown > 0 || isResending}
                    >
                        <Text style={[styles.resendText, { color: countdown > 0 ? 'gray' : '#007AFF' }]}>
                            {isResending ? "Resending..." : "Resend OTP"}
                        </Text>
                    </TouchableOpacity>

                    {/* Nút Tiếp tục */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isButtonEnabled ? '#007AFF' : '#D3D3D3' }]}
                        disabled={!isButtonEnabled}
                        onPress={handleVerifyOtp}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        paddingTop: 20
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        width: '80%',
    },
    countdownText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
    resendButton: {
        marginBottom: 20,
    },
    resendText: {
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});