import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Vibration,
  PermissionsAndroid,
  NativeModules,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import SmsAndroid from 'react-native-get-sms-android';
import LottieView from 'lottie-react-native';


const { AutoCall, AutoSMS } = NativeModules;
const { width, height } = Dimensions.get('window');

const EmergencyScreen = () => {
  const [contacts, setContacts] = useState(['', '', '']);
  const sosTimer = useRef(null);
  const safeTimer = useRef(null);
  const backgroundAnim = useRef(null);

  useEffect(() => {
    const loadContacts = async () => {
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) setContacts(JSON.parse(saved));
    };
    loadContacts();
  }, []);

  const saveContacts = async () => {
    await AsyncStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    Alert.alert('Contacts saved');
  };

  const requestPermissions = async () => {
    try {
      const callGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE
      );
      const smsGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS
      );
      const readSmsGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      const locGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      return (
        callGranted === PermissionsAndroid.RESULTS.GRANTED &&
        smsGranted === PermissionsAndroid.RESULTS.GRANTED &&
        readSmsGranted === PermissionsAndroid.RESULTS.GRANTED &&
        locGranted === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.warn('Permission error:', error);
      return false;
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const readRideDetailsFromSMS = () => {
    return new Promise((resolve, reject) => {
      const filter = { box: 'inbox', maxCount: 20 };
      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => reject('Failed to read SMS'),
        (count, smsList) => {
          try {
            const messages = JSON.parse(smsList);
            messages.sort((a, b) => b.date - a.date);
            const rideMsg = messages.find(
              (msg) =>
                msg.body &&
                (msg.body.toLowerCase().includes('ola') ||
                  msg.body.toLowerCase().includes('uber') ||
                  msg.body.toLowerCase().includes('rapido'))
            );
            if (rideMsg) {
              const vehicleMatch = rideMsg.body.match(/vehicle\s*number\s*[:\-]?\s*([A-Z0-9-]+)/i);
              const driverMatch = rideMsg.body.match(/driver\s*name\s*[:\-]?\s*([A-Za-z\s]+)/i);
              const phoneMatch = rideMsg.body.match(/(\+91\d{10}|\d{10})/);
              resolve({
                driverName: driverMatch?.[1]?.trim() ?? 'Not Found',
                vehicleNumber: vehicleMatch?.[1]?.trim() ?? 'Not Found',
                driverPhone: phoneMatch?.[1]?.trim() ?? 'Not Found',
              });
            } else {
              resolve({ driverName: 'Not Found', vehicleNumber: 'Not Found', driverPhone: 'Not Found' });
            }
          } catch (e) {
            reject('Error parsing SMS list');
          }
        }
      );
    });
  };

  const triggerSOS = async () => {
    try {
      const permsGranted = await requestPermissions();
      if (!permsGranted) {
        Alert.alert('Permissions Denied', 'All permissions are required.');
        return;
      }

      const coords = await getLocation();
      const rideDetails = await readRideDetailsFromSMS();
      Vibration.vibrate([500, 500, 500]);

      const validContacts = contacts.filter(
        num => num && num.trim().length >= 10 && /^\d+$/.test(num.trim())
      );

      const locText = coords ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}` : 'Location not available';

      const message = `I am in danger! Please help me.\nMy location: ${locText}\nDriver: ${rideDetails.driverName}\nVehicle: ${rideDetails.vehicleNumber}\nDriver Phone: ${rideDetails.driverPhone}`;

      for (const numberRaw of validContacts) {
        const number = numberRaw.trim().replace(/[^0-9]/g, '');
        try {
          await AutoSMS.sendSMS(number, message);
        } catch (e) {
          console.error(`Failed to send SMS to ${number}:`, e);
        }
      }

      const callContact = async (index) => {
        if (index >= validContacts.length) return;
        const number = validContacts[index].trim().replace(/[^0-9]/g, '');
        try {
          await AutoCall.makeCall(number);
        } catch (err) {
          console.error(`AutoCall failed to ${number}:`, err.message);
        }
        setTimeout(() => callContact(index + 1), 7000);
      };

      callContact(0);
      Alert.alert('SOS Sent', 'Emergency alerts sent to contacts.');
    } catch (err) {
      Alert.alert('Error', 'Something went wrong during SOS.');
    }
  };

  const triggerSafe = () => {
    Vibration.vibrate(500);
    Alert.alert('Safe', 'Safe message sent (simulated)');
  };

  const handleLongPress = (type) => {
    const timerRef = type === 'sos' ? sosTimer : safeTimer;
    timerRef.current = setTimeout(() => {
      if (type === 'sos') triggerSOS();
      else triggerSafe();
    }, 10000);
  };

  const cancelLongPress = (type) => {
    const timerRef = type === 'sos' ? sosTimer : safeTimer;
    clearTimeout(timerRef.current);
  };

  return (
    <View style={styles.fullScreen}>
      {/* Background Lottie */}
      <LottieView
        source={require('../assets/homebg.json')}
        autoPlay
        loop
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        ref={backgroundAnim}
      />

      <ScrollView contentContainerStyle={styles.overlay}>
        {/* Header Animation */}
        <LottieView
          source={require('../assets/danger.json')}
          autoPlay
          loop
          style={styles.headerAnimation}
        />

        <Text style={styles.mainHeading}>Are you in Danger?</Text>
        <Text style={styles.subHeading}>Save your contacts and alert them in emergencies</Text>
        <LottieView
          source={require('../assets/cab.json')}
          autoPlay
          loop
          style={styles.headerAnimation}
        />

        {contacts.map((num, index) => (
          <TextInput
            key={index}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder={`Contact ${index + 1}`}
            value={num}
            onChangeText={(text) => {
              const newContacts = [...contacts];
              newContacts[index] = text;
              setContacts(newContacts);
            }}
          />
        ))}

        <TouchableWithoutFeedback onPress={saveContacts}>
          <View style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Contacts</Text>
          </View>
        </TouchableWithoutFeedback>

        {/* SOS Lottie (acts like a button) */}
        <TouchableWithoutFeedback
          onPressIn={() => handleLongPress('sos')}
          onPressOut={() => cancelLongPress('sos')}
        >
          <LottieView
            source={require('../assets/sos.json')}
            autoPlay
            loop
            style={styles.actionButton}
          />
        </TouchableWithoutFeedback>

        {/* SAFE Lottie (acts like a button) */}
        <TouchableWithoutFeedback
          onPressIn={() => handleLongPress('safe')}
          onPressOut={() => cancelLongPress('safe')}
        >
          <LottieView
            source={require('../assets/safe.json')}
            autoPlay
            loop
            style={styles.actionButton}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#000', // fallback background
  },
  overlay: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  headerAnimation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveBtn: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '60%',
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionButton: {
    width: width * 0.6,
    height: 120,
    marginBottom: 20,
  },
});
