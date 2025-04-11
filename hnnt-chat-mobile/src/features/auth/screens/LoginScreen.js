import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/AuthService'; // Import hàm login từ AuthService
import LoggedInDeviceService from '../../profile/services/LoggedInDeviceService'; // Import LoggedInDeviceService
import * as Device from 'expo-device';
import { Platform } from 'react-native';
export default function LoginScreen() {
    const navigation = useNavigation();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const isFormFilled = phone.length == 10 && password.length >= 8;

    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handleLogin = async () => {
        try {
            Keyboard.dismiss(); // Ẩn bàn phím
            const { token, user } = await login(phone, password);

            // Lưu token và user vào AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user)); // Stringify user object

            // Add the current device to the logged-in devices list
            const deviceInfo = {
                userId: user.id,
                deviceId: Device.osInternalBuildId || 'unknown-device-id',
                deviceName: Device.deviceName || 'unknown-device',
                platform: Platform.OS,
                accessToken: token,
                ipAddress: '192.168.1.100', // giống đoạn fetch ở trên
            };
            console.log(deviceInfo);
            await LoggedInDeviceService.addDevice(deviceInfo);

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
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={25}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TouchableOpacity>
                            <Text
                                style={styles.forgotPasswordText}
                                onPress={() => navigation.navigate('Recover password')}
                            >
                                Recover password ?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingTop: 20 }}>
                        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    isFormFilled ? { backgroundColor: '#007AFF' } : { backgroundColor: '#E5E5E5' },
                                ]}
                                disabled={!isFormFilled}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleLogin}
                            >
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </Animated.View>
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
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputPassword: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
    },
    eyeIcon: {
        padding: 5,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
        marginBottom: 20,
    },
    button: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
