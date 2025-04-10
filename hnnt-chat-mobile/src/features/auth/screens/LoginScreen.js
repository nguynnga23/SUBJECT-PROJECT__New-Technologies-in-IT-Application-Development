import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/AuthService'; // Import hàm login từ AuthService

export default function LoginScreen() {
    const navigation = useNavigation();
    const navigation = useNavigation();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const isFormFilled = phone.length == 10 && password.length >= 8;

    const handleLogin = async () => {
        try {
            Keyboard.dismiss(); // Ẩn bàn phím
            const { token, user } = await login(phone, password);
    const handleLogin = async () => {
        try {
            Keyboard.dismiss(); // Ẩn bàn phím
            const { token, user } = await login(phone, password);

            // Lưu token vào AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user)); // Chuyển user thành chuỗi JSON
            // Lưu token vào AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user)); // Chuyển user thành chuỗi JSON

            Alert.alert('Login Successful', `Welcome, ${user.name}!`);
            // Điều hướng đến màn hình chính
            navigation.navigate('HomeTab');
        } catch (error) {
            console.warn('Login failed:', error);
            Alert.alert('Login Failed', 'Số điện thoại hoặc mật khẩu không đúng');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <KeyboardAvoidingView>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#D6EAF8',
                            paddingTop: 10,
                        }}
                    >
                        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Login</Text>
                    </View>
    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <KeyboardAvoidingView>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#D6EAF8',
                            paddingTop: 10,
                        }}
                    >
                        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Login</Text>
                    </View>

                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        <Text style={styles.description}>Please enter your phone number and password to login</Text>
                    </View>
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        <Text style={styles.description}>Please enter your phone number and password to login</Text>
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TouchableOpacity>
                            <Text
                                style={styles.forgotPasswordText}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingTop: 60 }}>
                        <TouchableOpacity
                            style={[styles.nextButton, isFormFilled ? styles.buttonEnabled : styles.buttonDisabled]}
                            disabled={!isFormFilled}
                            onPress={handleLogin}
                        >
                            <Text style={styles.nextButtonText}>→</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaProvider>
        </SafeAreaView>
    );
                    <View style={{ paddingTop: 60 }}>
                        <TouchableOpacity
                            style={[styles.nextButton, isFormFilled ? styles.buttonEnabled : styles.buttonDisabled]}
                            disabled={!isFormFilled}
                            onPress={handleLogin}
                        >
                            <Text style={styles.nextButtonText}>→</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
        marginBottom: 20,
    },
    nextButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonEnabled: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5E5',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
        marginBottom: 20,
    },
    nextButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonEnabled: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5E5',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
});

