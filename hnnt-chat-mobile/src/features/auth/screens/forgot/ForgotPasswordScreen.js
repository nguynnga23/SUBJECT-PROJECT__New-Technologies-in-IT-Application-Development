import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
import { useNavigation } from "@react-navigation/native";
// import CheckBox from '@react-native-community/checkbox';

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();

    const [info, setInfo] = useState('');

    const isButtonEnabled = info.length >= 10;

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Enter phone number or Email</Text>

                {/* Ô nhập số điện thoại hoặc email */}
                <TextInput
                    style={styles.input}
                    placeholder="Your phone number or email"
                    value={info}
                    onChangeText={setInfo}
                />

                {/* Nút Tiếp tục */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isButtonEnabled ? '#007AFF' : '#D3D3D3' }]}
                    disabled={!isButtonEnabled} // Chặn bấm nếu không đủ điều kiện
                    onPress={() => {
                        if (isButtonEnabled) {
                            navigation.navigate('Forgot_OTPConfirm');
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },

    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },

    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },

    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },

    text: { marginLeft: 10 },

    button: { padding: 15, borderRadius: 5, alignItems: 'center' },

    buttonText: { color: '#fff', fontWeight: 'bold' },

    link: { color: 'blue', textDecorationLine: 'underline' },
    webview: { flex: 1, width: '100%', marginTop: 20 }
});
