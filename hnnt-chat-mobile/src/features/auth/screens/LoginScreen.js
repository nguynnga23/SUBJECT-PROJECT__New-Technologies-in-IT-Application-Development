// import { View, Text, Button } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function LoginScreen() {
//   const navigation = useNavigation();

//   return (
//     <View>
//       <Text>Login Screen</Text>
//       <Button title="Go to Home" onPress={() => navigation.navigate("HomeTab")} />
//     </View>
//   );
// }

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const isFormFilled = phone.length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#D6EAF8' }}>
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/icons/back.png')} style={{ height: 30, width: 30 }} />
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
      <TouchableOpacity
        style={[styles.nextButton, isFormFilled ? styles.buttonEnabled : styles.buttonDisabled]}
        disabled={!isFormFilled} // Chỉ bấm khi đã điền đầy đủ thông tin
        onPress={() => {
          if (isFormFilled) {
            // Điều hướng hoặc xử lý đăng nhập
          }
        }}
      >
        <Text style={styles.nextButtonText}>→</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
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
