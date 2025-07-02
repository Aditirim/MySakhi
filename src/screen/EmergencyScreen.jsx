import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  PermissionsAndroid,
  NativeModules,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import SmsAndroid from 'react-native-get-sms-android';

const { AutoCall, AutoSMS } = NativeModules;

const EmergencyScreen = () => {
  const [contacts, setContacts] = useState(['', '', '']);
  const sosTimer = useRef(null);
  const safeTimer = useRef(null);

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
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        { title: 'Call Permission', message: 'SheSafe needs access to make calls.', buttonPositive: 'OK' }
      );

      const smsGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        { title: 'SMS Permission', message: 'SheSafe needs permission to send SMS.', buttonPositive: 'OK' }
      );

      const readSmsGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        { title: 'Read SMS Permission', message: 'SheSafe needs permission to read SMS.', buttonPositive: 'OK' }
      );

      const locGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        { title: 'Location Permission', message: 'SheSafe needs location access.', buttonPositive: 'OK' }
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
      const filter = {
        box: 'inbox',
        maxCount: 20,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.log('Failed to read SMS:', fail);
          reject('Failed to read SMS');
        },
        (count, smsList) => {
          try {
            let messages = JSON.parse(smsList);
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
            console.error('Error parsing smsList:', e);
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
      Alert.alert('SOS Sent', 'Emergency alerts sent to contacts.');

      const validContacts = contacts.filter(
        num => num && num.trim().length >= 10 && /^\d+$/.test(num.trim())
      );

      const locText = coords ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}` : 'Location not available';

      const message = `I am in danger! Please help me.\nMy location: ${locText}\nDriver: ${rideDetails.driverName}\nVehicle: ${rideDetails.vehicleNumber}\nDriver Phone: ${rideDetails.driverPhone}`;

      for (const numberRaw of validContacts) {
        const number = numberRaw.trim().replace(/[^0-9]/g, '');
        try {
          await AutoSMS.sendSMS(number, message);
          console.log(`✅ SMS sent to ${number}`);
        } catch (e) {
          console.error(`❌ Failed to send SMS to ${number}:`, e);
        }
      }

      const callContact = async (index) => {
        if (index >= validContacts.length) return;

        const number = validContacts[index].trim().replace(/[^0-9]/g, '');
        if (!/^\d{10,}$/.test(number)) {
          setTimeout(() => callContact(index + 1), 1000);
          return;
        }

        try {
          console.log(`📞 Auto-calling ${number}`);
          await AutoCall.makeCall(number);
        } catch (err) {
          console.error(`❌ AutoCall failed to ${number}:`, err.message);
        }

        setTimeout(() => callContact(index + 1), 7000);
      };

      callContact(0);

    } catch (err) {
      console.error('SOS error:', err);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>

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

      <TouchableOpacity style={styles.saveBtn} onPress={saveContacts}>
        <Text style={styles.saveText}>Save Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sosBtn}
        onPressIn={() => handleLongPress('sos')}
        onPressOut={() => cancelLongPress('sos')}
      >
        <Text style={styles.btnText}>HOLD for 10s to SEND SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.safeBtn}
        onPressIn={() => handleLongPress('safe')}
        onPressOut={() => cancelLongPress('safe')}
      >
        <Text style={styles.btnText}>HOLD for 10s to SAY SAFE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: '#6c757d',
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
  },
  sosBtn: {
    backgroundColor: '#dc3545',
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
  },
  safeBtn: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
