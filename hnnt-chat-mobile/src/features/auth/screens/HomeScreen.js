import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
                <Text style={styles.title}>Welcome to HNNT</Text>

                <View style={{ paddingTop: 40, paddingBottom: 40 }}>
                    <Image source={require('../../../assets/icons/img_HomeScreen.png')} style={styles.image} />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpText}>Create new account</Text>
                </TouchableOpacity>
            </SafeAreaProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    title: {
        paddingTop: 100,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        alignSelf: 'center',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        backgroundColor: '#E5E5E5',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    signUpText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});