import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
import { useNavigation } from "@react-navigation/native";
// import CheckBox from '@react-native-community/checkbox';

export default function PhoneNumSignUpScreen() {
    const navigation = useNavigation();

    const [phone, setPhone] = useState('');
    // const [agree, setAgree] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const isButtonEnabled = phone.length == 10;

    // Kiểm tra nếu đã nhập số điện thoại và chọn cả 2 checkbox
    // const isButtonEnabled = phone.length == 10 && agree;

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Enter phone number</Text>

                {/* Ô nhập số điện thoại */}
                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                {/* Các checkbox */}
                {/* <View style={styles.checkboxContainer}>
                <CheckBox value={agree} onValueChange={setAgree} />
                <Text style={styles.text}>
                    I agree to the{' '}
                    <Text style={styles.link} onPress={() => setShowTerms(true)}>
                        terms of use
                    </Text>
                </Text>

                {showTerms && (
                    <WebView
                        originWhitelist={['*']}
                        source={require('../../../assets/terms-of-use.html')}
                        style={styles.webview}
                    />
                )}
            </View> */}

                {/* Nút Tiếp tục */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isButtonEnabled ? '#007AFF' : '#D3D3D3' }]}
                    disabled={!isButtonEnabled} // Chặn bấm nếu không đủ điều kiện
                    onPress={() => {
                        if (isButtonEnabled) {
                            navigation.navigate('OTPConfirm');
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
