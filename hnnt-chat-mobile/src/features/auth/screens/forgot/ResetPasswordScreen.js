import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../../services/ForgotPasswordService';

export default function ResetPasswordScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { phone } = route.params;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isPasswordValid = password.length >= 8 && passwordStrength !== 'weak';
    const isConfirmPasswordValid = confirmPassword === password;
    const isButtonEnabled = isPasswordValid && isConfirmPasswordValid;

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

    const handleChangePassword = async () => {
        if (!isButtonEnabled) {
            Alert.alert("Invalid Input", "Please check your input fields.");
            return;
        }

        setIsLoading(true); // Bắt đầu trạng thái loading
        try {
            const response = await changePassword(phone, password);
            if (response.success) {
                Alert.alert("Success", "Password reset successful!");
                navigation.navigate('Login'); // Điều hướng đến màn hình đăng nhập
            } else {
                Alert.alert("Error", response.message || "Failed to reset password.");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "An error occurred.");
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
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
                    <Text style={styles.title}>Create Password</Text>

                    <Text style={styles.description}>
                        Password must have at least 8 characters, including numbers and letters.
                        We recommend your password should have uppercase letters and symbols.
                    </Text>

                    {/* Ô nhập Password */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { borderColor: isPasswordValid ? '#ccc' : 'red' }]}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                evaluatePasswordStrength(text);
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={25}
                                color="#666"
                            />
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

                    {/* Ô nhập Confirm Password */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { borderColor: isConfirmPasswordValid ? '#ccc' : 'red' }]}
                            placeholder="Confirm Password"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                            <Ionicons
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                size={25}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                    {!isConfirmPasswordValid && confirmPassword.length > 0 && (
                        <Text style={styles.errorText}>Passwords do not match</Text>
                    )}

                    {/* Nút Tiếp tục */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isButtonEnabled && !isLoading ? '#007AFF' : '#D3D3D3' }]}
                        disabled={!isButtonEnabled || isLoading}
                        onPress={handleChangePassword}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Processing...' : 'Next'}
                        </Text>
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
        paddingTop: 20,
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
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        flex: 1,
        fontSize: 18,
        paddingVertical: 12,
    },
    eyeIcon: {
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
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