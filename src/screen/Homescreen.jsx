import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsAndroid from 'react-native-get-sms-android';
import Geolocation from 'react-native-geolocation-service';

const Homescreen = () => {
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [contacts, setContacts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const loadContacts = async () => {
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) setContacts(JSON.parse(saved));
    };
    loadContacts();
  }, []);

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
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        console.log('Location error:', error);
        setLocation(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleStartRide = async () => {
    if (Platform.OS === 'android') {
      setFetching(true);
      const hasPermission = await requestSmsPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'SMS read permission is needed.');
        setFetching(false);
        return;
      }

      const filter = {
        box: 'inbox',
        maxCount: 20,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.log('Failed to read SMS:', fail);
          Alert.alert('Error', 'Failed to read SMS.');
          setFetching(false);
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

              setDriverName(driverMatch?.[1]?.trim() ?? 'Not Found');
              setVehicleNumber(vehicleMatch?.[1]?.trim() ?? 'Not Found');
              setDriverPhone(phoneMatch?.[1]?.trim() ?? 'Not Found');

              Alert.alert('Ride Detected', 'Details have been fetched automatically.');
              fetchLocation();
            } else {
              Alert.alert('No recent ride SMS found.');
            }
          } catch (e) {
            console.error('Error parsing smsList:', e);
            Alert.alert('Error', 'Could not parse SMS list.');
          } finally {
            setFetching(false);
          }
        }
      );
    } else {
      Alert.alert('Unsupported Platform', 'SMS reading is supported on Android only.');
    }
  };

  const handleMarkSafe = () => {
    Alert.alert('Status', 'Your safe status has been sent to your emergency contacts.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SheSafe Travel Monitor</Text>

      <TouchableOpacity style={styles.fetchButton} onPress={handleStartRide}>
        <Text style={styles.fetchButtonText}>Fetch Latest Ride Details</Text>
      </TouchableOpacity>

      {fetching && <ActivityIndicator size="large" color="#d63384" style={{ marginBottom: 20 }} />}

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Driver Name: <Text style={styles.value}>{driverName || 'Awaiting'}</Text></Text>
        <Text style={styles.label}>Vehicle Number: <Text style={styles.value}>{vehicleNumber || 'Awaiting'}</Text></Text>
        <Text style={styles.label}>Driver Phone: <Text style={styles.value}>{driverPhone || 'Awaiting'}</Text></Text>
        <Text style={styles.label}>Your Location: 
          <Text style={styles.value}> {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Not Detected'}</Text>
        </Text>
      </View>

      <View style={styles.contactsBox}>
        <Text style={styles.contactsTitle}>Emergency Contacts</Text>
        {contacts.length ? (
          contacts.map((num, idx) => (
            <Text key={idx} style={styles.contactItem}>
              {idx + 1}. {num || 'Not Set'}
            </Text>
          ))
        ) : (
          <Text style={styles.contactItem}>No contacts saved</Text>
        )}
      </View>

      <TouchableOpacity style={styles.monitorButton} onPress={() => Alert.alert('Monitoring', 'Ride monitoring started')}>
        <Text style={styles.monitorButtonText}>Start Monitoring Ride</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.safeButton} onPress={handleMarkSafe}>
        <Text style={styles.monitorButtonText}>Mark as Safe</Text>
      </TouchableOpacity>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>🛡️ Safety Tips</Text>
        <Text style={styles.tipText}>• Always verify the driver and vehicle details.</Text>
        <Text style={styles.tipText}>• Share your trip with a trusted contact.</Text>
        <Text style={styles.tipText}>• Prefer the back seat when traveling alone.</Text>
      </View>
    </ScrollView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 20,
    textAlign: 'center',
  },
  fetchButton: {
    backgroundColor: '#d63384',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsBox: {
    backgroundColor: '#f0f0f0',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontWeight: 'bold',
    color: '#222',
  },
  contactsBox: {
    backgroundColor: '#e9ecef',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  contactItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  monitorButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  safeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  monitorButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  tipBox: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  tipText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
});
