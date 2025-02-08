import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const isFormFilled = phone.length > 0 && password.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaProvider>
        <KeyboardAvoidingView>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#D6EAF8', paddingTop: 10 }}>
            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Login</Text>
          </View>


          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <Text style={styles.description}>
              Please enter your phone number and password to login
            </Text>
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
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Nút "Next" */}
          <View style={{ paddingTop: 60 }}>
            <TouchableOpacity
              style={[styles.nextButton, isFormFilled ? styles.buttonEnabled : styles.buttonDisabled]}
              disabled={!isFormFilled} // Chỉ bấm khi đã điền đầy đủ thông tin
              onPress={() => {
                if (isFormFilled) {
                  // Điều hướng hoặc xử lý đăng nhập
                  navigation.navigate('HomeTab');
                }
              }}
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
});
