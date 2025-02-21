import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddEmail() {
    const [email, setEmail] = useState('');

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <View style={styles.container}>
            {/* Ô nhập email */}
            <Text style={styles.label}>Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="username@domain.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                autoFocus
            />

            {/* Lưu ý */}
            <View style={styles.noteContainer}>
                <Text style={styles.title}>Notice</Text>

                <Text style={styles.note}>
                    Protect your account by <Text style={styles.bold}>ONLY LINKING</Text> to an email that you own.
                </Text>
                <Text style={styles.note}>
                    HNNT Chat <Text style={styles.bold}>NEVER ASKS</Text> for your account information, password, or OTP
                    via email.
                </Text>
            </View>

            {/* Nút liên kết */}
            <TouchableOpacity
                style={[styles.button, isValidEmail(email) ? styles.buttonActive : styles.buttonDisabled]}
                disabled={!isValidEmail(email)}
            >
                <Text style={isValidEmail(email) ? styles.buttonTextActive : styles.buttonTextDisabled}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
}

// 📌 Định nghĩa style
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#A0A0A0',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#000',
    },
    noteContainer: {
        marginTop: 20,
    },
    note: {
        fontSize: 13,
        color: '#000',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    button: {
        marginTop: 40,
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActive: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#DEE3E7',
    },
    buttonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonTextDisabled: {
        color: '#A0A0A0',
    },
});
