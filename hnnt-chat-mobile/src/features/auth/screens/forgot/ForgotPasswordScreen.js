import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { forgotPassword } from '../../services/ForgotPasswordService';

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Regular expressions for validation
    const phoneRegex = /^(03|05|07|08|09|01|02)\d{8}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isPhoneValid = phoneRegex.test(phone);
    const isEmailValid = emailRegex.test(email);

    const handleNext = async () => {
        if (!isPhoneValid && !isEmailValid) {
            Alert.alert("Invalid Input", "Please enter a valid phone number or email.");
            return;
        }

        setIsLoading(true); // Bắt đầu trạng thái loading
        try {
            const response = await forgotPassword(phone, email);
            if (response.message === "Mã OTP đã được gửi qua email!") {
                navigation.navigate('Forgot_OTPConfirm', { email, phone }); // Pass info to Forgot_OTPConfirm
            } else {
                Alert.alert("Error", "Failed to process request.");
            }
        } catch (error) {
            Alert.alert("Error", "Phone number not registered yet!");
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

                <TextInput
                    style={[styles.input, { borderColor: isPhoneValid || phone.length === 0 ? '#ccc' : 'red' }]}
                    placeholder="Your phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                {!isPhoneValid && phone.length > 0 && (
                    <Text style={styles.errorText}>Invalid phone number</Text>
                )}

                <TextInput
                    style={[styles.input, { borderColor: isEmailValid || email.length === 0 ? '#ccc' : 'red' }]}
                    placeholder="Your email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                {!isEmailValid && email.length > 0 && (
                    <Text style={styles.errorText}>Invalid email</Text>
                )}

                {/* Nút Tiếp tục */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isPhoneValid && isEmailValid && !isLoading ? '#007AFF' : '#D3D3D3' }]}
                    disabled={!isPhoneValid || !isEmailValid || isLoading}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Processing...' : 'Next'}
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