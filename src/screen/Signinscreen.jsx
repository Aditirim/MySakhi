import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';

const SigninScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) setStoredUser(JSON.parse(data));
    };
    getUser();
  }, []);

  const handleLogin = (values) => {
    if (!storedUser) {
      Alert.alert('No user found', 'Please sign up first');
      return;
    }

    if (values.email === storedUser.email && values.password === storedUser.password) {
      Alert.alert('Success', `Welcome ${storedUser.name}`);
      navigation.navigate('Homescreen');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().min(6).required('Password is required'),
        })}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize="none"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity onPress={() => Alert.alert('Reset password flow')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#d63384' },
  label: { marginBottom: 4, fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    fontSize: 16, marginBottom: 10, backgroundColor: '#f9f9f9'
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 10, backgroundColor: '#f9f9f9' },
  eyeIcon: { padding: 12 },
  forgotText: { color: '#d63384', textAlign: 'right', marginBottom: 20 },
  button: {
    backgroundColor: '#d63384', padding: 14, borderRadius: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#d63384', marginTop: 20 },
  error: { color: 'red', fontSize: 13, marginBottom: 10 },
});
