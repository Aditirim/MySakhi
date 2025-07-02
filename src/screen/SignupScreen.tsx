import React from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignupScreen = ({ navigation }) => {
  const handleSignup = async (values) => {
    await AsyncStorage.setItem('user', JSON.stringify(values));
    Alert.alert('Success', 'Account created successfully');
    navigation.navigate('SigninScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().min(6).required('Password is required'),
        })}
        onSubmit={handleSignup}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize="none"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#d63384' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    marginBottom: 10, fontSize: 16, backgroundColor: '#f9f9f9'
  },
  button: {
    backgroundColor: '#d63384', padding: 14, borderRadius: 10, marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#d63384', marginTop: 20 },
  error: { color: 'red', fontSize: 13, marginBottom: 10 },
  orText: { textAlign: 'center', marginTop: 10, color: '#999' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  socialButton: {
    borderWidth: 1, borderColor: '#ccc', paddingVertical: 10,
    paddingHorizontal: 20, borderRadius: 8, marginHorizontal: 5
  },
  socialText: { color: '#333' },
});
