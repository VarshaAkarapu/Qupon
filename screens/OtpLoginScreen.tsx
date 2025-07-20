import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import axios from 'axios';

const OtpLoginScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const sendOtp = async () => {
    try {
      if (!phoneNumber) {
        Alert.alert('Enter a valid phone number');
        return;
      }

      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('OTP sent successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      if (!confirm || !otp) {
        Alert.alert('Please enter OTP');
        return;
      }
      const userCredential = await confirm.confirm(otp) as FirebaseAuthTypes.UserCredential;


      // const userCredential: FirebaseAuthTypes.UserCredential = await confirm.confirm(otp);

      if (userCredential && userCredential.user) {
        const { phoneNumber, uid } = userCredential.user;

        // Call backend to save phoneNumber
        await axios.post('http://localhost:5000/api/auth/verify-phone', {
          phoneNumber,
          firebaseUid: uid,
        });

        Alert.alert('Login successful');

        // Navigate to home or any screen
        // navigation.navigate('Home');
      } else {
        Alert.alert('User not found after OTP verification');
      }
    } catch (error) {
      console.error('OTP verification failed', error);
      Alert.alert('Invalid OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone OTP Login</Text>

      {!confirm ? (
        <>
          <TextInput
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TouchableOpacity onPress={sendOtp} style={styles.button}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity onPress={verifyOtp} style={styles.button}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default OtpLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
