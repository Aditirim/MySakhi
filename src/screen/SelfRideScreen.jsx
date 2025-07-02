import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const Homescreen = () => {
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'SheSafe needs access to your SMS to detect ride bookings.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleStartRide = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestSmsPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'SMS read permission is needed.');
        return;
      }

      SmsAndroid.list(
  JSON.stringify({ box: 'inbox', maxCount: 10 }),
  (fail) => console.log("Failed to read SMS: ", fail),
  (smsList) => {
    const messages = JSON.parse(smsList);
    const rideMsg = messages.find(msg =>
      msg.body.toLowerCase().includes('ola') || msg.body.toLowerCase().includes('uber')
    );

    if (rideMsg) {
      const vehicleMatch = rideMsg.body.match(/vehicle\\s*number\\s*[:\\-]?\\s*([A-Z0-9-]+)/i);
      const driverMatch = rideMsg.body.match(/driver\\s*name\\s*[:\\-]?\\s*([A-Za-z\\s]+)/i);
      const phoneMatch = rideMsg.body.match(/(\\+91\\d{10}|\\d{10})/);

      setDriverName(driverMatch?.[1] ?? 'Not Found');
      setVehicleNumber(vehicleMatch?.[1] ?? 'Not Found');
      setDriverPhone(phoneMatch?.[1] ?? 'Not Found');
    } else {
      Alert.alert('No recent ride SMS found.');
    }
  }
);

    } else {
      Alert.alert('Unsupported Platform', 'SMS reading is supported on Android only.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SheSafe Travel Monitor</Text>

      <TouchableOpacity style={styles.startButton} onPress={handleStartRide}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Driver Name: <Text style={styles.value}>{driverName}</Text></Text>
        <Text style={styles.label}>Vehicle Number: <Text style={styles.value}>{vehicleNumber}</Text></Text>
        <Text style={styles.label}>Driver Phone: <Text style={styles.value}>{driverPhone}</Text></Text>
      </View>
    </ScrollView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#d63384',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsBox: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  value: {
    fontWeight: 'bold',
    color: '#222',
  },
});