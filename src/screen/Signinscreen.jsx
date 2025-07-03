import React, { useState, useEffect } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native'; // <- Import Lottie

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '600130290713-qq7cppt7308acsf9gnrb7s44f65mi015.apps.googleusercontent.com',
    });
  }, []);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;

      await firestore().collection('users').doc(uid).set({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Account created!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Signup error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const userSignIn = await auth().signInWithCredential(googleCredential);

      const { uid, displayName, email } = userSignIn.user;
      await firestore().collection('users').doc(uid).set({
        name: displayName,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Signed in with Google!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google sign-in failed.');
    }
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <LottieView
              source={require('../assets/anim4.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.appName}>SheRaksha</Text>
            <Text style={styles.slogan}>Drop the fear at the pickup point</Text>
          </View>

          <View style={styles.signupBox}>
            <Text style={styles.signInTitle}>Be Safe</Text>

            {/* Name input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={22} color="#999" style={styles.iconStyle} />
              <TextInput
                placeholder="Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email input */}
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#999" style={styles.iconStyle} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={22} color="#999" style={styles.iconStyle} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <MaterialCommunityIcons
                  name={secureText ? 'eye-off' : 'eye'}
                  size={22}
                  color="#999"
                  style={styles.eyeIconStyle}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSignup} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.orTextCenter}>Or continue with</Text>

            <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
              <AntDesign name="google" size={22} color="#fff" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.signupLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;

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
    fontWeight: '600',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 0,
  },
  slogan: {
    fontSize: 16,
    color: '#004d40',
    textAlign: 'center',
    marginBottom: 40,
  },
  signupBox: {
    backgroundColor: '#fff',
    padding: 28,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
    width: '100%',
    minHeight: 500,
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1fefe',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  iconStyle: {
    marginRight: 8,
  },
  eyeIconStyle: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#00c6c2',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  orTextCenter: {
    textAlign: 'center',
    color: '#555',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00796b',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    marginHorizontal: 60,
    shadowColor: '#00796b',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#555',
    fontSize: 15,
  },
  signupLink: {
    color: '#00796b',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
