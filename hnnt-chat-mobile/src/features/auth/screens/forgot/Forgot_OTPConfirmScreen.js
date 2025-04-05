import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Forgot_OTPConfirmScreen() {
    const navigation = useNavigation();
    const [otp, setOtp] = useState('');

    // Kiểm tra nếu đã nhập đủ 6 số thì mới cho bấm Next
    const isButtonEnabled = otp.length === 6;

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

                    {/* Nút Gửi lại OTP */}
                    <TouchableOpacity onPress={() => console.log("Resend OTP")} style={styles.resendButton}>
                        <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>

                    {/* Nút Tiếp tục */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isButtonEnabled ? '#007AFF' : '#D3D3D3' }]}
                        disabled={!isButtonEnabled}
                        onPress={() => {
                            navigation.navigate('ResetPassword');
                            Alert.alert("OTP Confirmed", "Successful!");
                        }
                        }
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
    backIcon: {
        width: 30,
        height: 30,
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
    resendButton: {
        marginBottom: 20,
    },
    resendText: {
        color: '#007AFF',
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
