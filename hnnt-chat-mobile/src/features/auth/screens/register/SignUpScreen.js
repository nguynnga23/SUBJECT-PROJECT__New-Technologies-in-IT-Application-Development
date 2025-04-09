import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { register, sendOtp } from '../../services/RegisterService';

export default function SignUpScreen() {
    const navigation = useNavigation();

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Trạng thái để kiểm soát nút

    // Regular expressions for validation
    const phoneRegex = /^(03|05|07|08|09|01|02)\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isPhoneValid = phoneRegex.test(phone);
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 8 && passwordStrength !== 'weak';
    const isConfirmPasswordValid = confirmPassword === password;

    const isButtonEnabled =
        isPhoneValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid;

    // Function to evaluate password strength
    const evaluatePasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength('invalid');
        } else if (/^[0-9]+$/.test(password)) {
            setPasswordStrength('weak');
        } else if (password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && !/[@$!%*?&#]/.test(password)) {
            setPasswordStrength('medium');
        } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[@$!%*?&#]/.test(password)) {
            setPasswordStrength('strong');
        }
    };

    const handleNext = async () => {
        if (!isButtonEnabled) {
            Alert.alert("Invalid Input", "Please check your input fields.");
            return;
        }

        setIsLoading(true); // Bắt đầu trạng thái loading
        try {
            // Call register API
            const registerResponse = await register(email, phone, password);
            if (registerResponse.message === "Đăng ký thành công!") {
                // Call sendOtp API
                const otpResponse = await sendOtp(email);
                if (otpResponse.message === "Mã OTP đã được gửi qua email!") {
                    navigation.navigate('OTPConfirm', { email }); // Pass email to OTPConfirm
                } else {
                    Alert.alert("Error", "Failed to send OTP.");
                }
            } else {
                Alert.alert("Error", "Registration failed.");
            }
        } catch (error) {
            Alert.alert("Error", "Phone number or email already exists.");
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Enter phone number</Text>

                {/* Phone Input */}
                <TextInput
                    style={[styles.input, { borderColor: isPhoneValid ? '#ccc' : 'red' }]}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                {!isPhoneValid && phone.length > 0 && (
                    <Text style={styles.errorText}>Invalid phone number</Text>
                )}

                {/* Email Input */}
                <TextInput
                    style={[styles.input, { borderColor: isEmailValid ? '#ccc' : 'red' }]}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                {!isEmailValid && email.length > 0 && (
                    <Text style={styles.errorText}>Invalid email address</Text>
                )}

                {/* Password Input */}
                <TextInput
                    style={[styles.input, { borderColor: isPasswordValid ? '#ccc' : 'red' }]}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        evaluatePasswordStrength(text);
                    }}
                />
                {password.length > 0 && (
                    <Text
                        style={{
                            color:
                                passwordStrength === 'weak'
                                    ? 'red'
                                    : passwordStrength === 'invalid'
                                        ? 'red'
                                        : passwordStrength === 'medium'
                                            ? 'orange'
                                            : 'green',
                        }}
                    >
                        {passwordStrength === 'weak'
                            ? 'Weak password'
                            : passwordStrength === 'invalid'
                                ? 'Password must be at least 8 characters'
                                : passwordStrength === 'medium'
                                    ? 'Medium password'
                                    : 'Strong password'}
                    </Text>
                )}

                {/* Confirm Password Input */}
                <TextInput
                    style={[styles.input, { borderColor: isConfirmPasswordValid ? '#ccc' : 'red' }]}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                {!isConfirmPasswordValid && confirmPassword.length > 0 && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {/* Next Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isButtonEnabled && !isLoading ? '#007AFF' : '#D3D3D3' }]}
                    disabled={!isButtonEnabled || isLoading}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Sending OTP...' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },

    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },

    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },

    errorText: { color: 'red', fontSize: 12, marginBottom: 10 },

    button: { padding: 15, borderRadius: 5, alignItems: 'center' },

    buttonText: { color: '#fff', fontWeight: 'bold' },
});