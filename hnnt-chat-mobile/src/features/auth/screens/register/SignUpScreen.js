import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { sendOtp } from '../../services/RegisterService';

export default function SignUpScreen() {
    const navigation = useNavigation();

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Regular expressions for validation
    const phoneRegex = /^(03|05|07|08|09|01|02)\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isPhoneValid = phoneRegex.test(phone);
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 8 && passwordStrength !== 'weak';
    const isConfirmPasswordValid = confirmPassword === password;

    const isButtonEnabled = isPhoneValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    // Function to evaluate password strength
    const evaluatePasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength('invalid');
        } else if (/^[0-9]+$/.test(password)) {
            setPasswordStrength('weak');
        } else if (
            password.length >= 8 &&
            /[a-zA-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            !/[@$!%*?&#]/.test(password)
        ) {
            setPasswordStrength('medium');
        } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[@$!%*?&#]/.test(password)) {
            setPasswordStrength('strong');
        }
    };

    const handleNext = async () => {
        if (!isButtonEnabled) {
            Alert.alert('Invalid Input', 'Please check your input fields.');
            return;
        }

        setIsLoading(true);
        try {
            const otpResponse = await sendOtp(email);
            if (otpResponse.message === 'Mã OTP đã được gửi qua email!') {
                navigation.navigate('OTPConfirm', { email, phone, password });
            } else {
                Alert.alert('Error', 'Failed to send OTP.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                {/* Removed custom header */}
                {/* Phone Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                {!isPhoneValid && phone.length > 0 && <Text style={styles.errorText}>Invalid phone number</Text>}

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                {!isEmailValid && email.length > 0 && <Text style={styles.errorText}>Invalid email address</Text>}

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            evaluatePasswordStrength(text);
                        }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={25} color="#666" />
                    </TouchableOpacity>
                </View>
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
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={25}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {!isConfirmPasswordValid && confirmPassword.length > 0 && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                <Text style={styles.description}>
                    Password must have at least 8 characters, including numbers and letters. We recommend your password
                    should have uppercase letters and symbols.
                </Text>

                {/* Next Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isButtonEnabled && !isLoading ? '#007AFF' : '#D3D3D3' }]}
                    disabled={!isButtonEnabled || isLoading}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Sending OTP...' : 'Next'}</Text>
                </TouchableOpacity>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },

    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, paddingLeft: 10 },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },

    description: {
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'center',
    },

    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, fontSize: 16 },

    inputPassword: { flex: 1, fontSize: 16, paddingVertical: 10 },

    eyeIcon: { padding: 5 },

    errorText: { color: 'red', fontSize: 12, marginBottom: 10 },

    button: { padding: 15, borderRadius: 5, alignItems: 'center' },

    buttonText: { color: '#fff', fontWeight: 'bold' },
});
