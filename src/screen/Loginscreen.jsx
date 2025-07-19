import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native'; // <- Import Lottie

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('MainApp');
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Forgot Password', 'Please enter your email above first.');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Email Sent', 'A password reset link has been sent to your email.');
      })
      .catch(error => {
        console.log('Reset Error:', error);
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            {/* Lottie Animation */}
            <LottieView
              source={require('../assets/anim3.json')}
              autoPlay
              loop
              style={styles.lottie}
            />

            <Text style={styles.appName}>SheRaksha</Text>
            <Text style={styles.slogan}>Drop the fear at the pickup point</Text>
          </View>

          <View style={styles.loginBox}>
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color="#555" style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#555"
                keyboardType="email-address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#555" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={styles.signupLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#eafcff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: -20,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00796b',
  },
  slogan: {
    fontSize: 16,
    color: '#004d40',
    marginTop: 4,
  },
  loginBox: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1fefe',
    borderColor: '#b2ebf2',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  forgotText: {
    textAlign: 'right',
    color: '#00796b',
    fontSize: 14,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: '#00a799',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#444',
    fontSize: 15,
  },
  signupLink: {
    color: '#00796b',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
