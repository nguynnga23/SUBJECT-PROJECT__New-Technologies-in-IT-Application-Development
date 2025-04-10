import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProfileService from '../../../services/ProfileService'; // Import the service
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState(null); // Trạng thái focus
    const [loading, setLoading] = useState(false); // Loading state

    const isValidPassword = (password) => {
        return password.length >= 6 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    };

    const isFormValid = () => {
        return isValidPassword(newPassword) && newPassword === confirmPassword && currentPassword.length > 0;
    };

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
            if (!token) {
                Alert.alert('Error', 'User not authenticated.');
                setLoading(false);
                return;
            }

            const response = await ProfileService.changePassword(token, {
                currentPassword,
                newPassword,
            });

            Alert.alert('Success', response.message || 'Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change password</Text>
            <Text style={styles.note}>
                Password must include letters, numbers or special characters; must not contain your year of birth or
                Zalo name.
            </Text>

            <Text style={styles.label}>Current password</Text>
            <TextInput
                style={[styles.input, focusedInput === 'current' ? styles.inputFocused : styles.inputDefault]}
                placeholder="Enter current password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onFocus={() => setFocusedInput('current')}
                onBlur={() => setFocusedInput(null)}
                autoFocus
            />

            <Text style={styles.label}>New password</Text>
            <TextInput
                style={[styles.input, focusedInput === 'new' ? styles.inputFocused : styles.inputDefault]}
                placeholder="Enter new password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => setFocusedInput('new')}
                onBlur={() => setFocusedInput(null)}
            />

            <TextInput
                style={[styles.input, focusedInput === 'confirm' ? styles.inputFocused : styles.inputDefault]}
                placeholder="Confirm new password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput('confirm')}
                onBlur={() => setFocusedInput(null)}
            />

            <TouchableOpacity
                style={[styles.button, isFormValid() ? styles.buttonActive : styles.buttonDisabled]}
                disabled={!isFormValid() || loading}
                onPress={handleChangePassword}
            >
                <Text style={isFormValid() ? styles.buttonTextActive : styles.buttonTextDisabled}>
                    {loading ? 'Updating...' : 'Update'}
                </Text>
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    note: {
        fontSize: 13,
        color: '#000',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 15,
    },
    input: {
        borderBottomWidth: 2,
        paddingVertical: 10,
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
    },
    inputDefault: {
        borderBottomColor: '#A0A0A0',
    },
    inputFocused: {
        borderBottomColor: '#007AFF',
    },
    button: {
        marginTop: 40,
        borderRadius: 25,
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
