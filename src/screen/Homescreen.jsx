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
  TextInput,
  Pressable,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsAndroid from 'react-native-get-sms-android';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TypeWriter from 'react-native-typewriter';

const Homescreen = () => {
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [contacts, setContacts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [location, setLocation] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    const loadContacts = async () => {
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) setContacts(JSON.parse(saved));
    };
    loadContacts();
  }, []);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]);

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'SheRaksha needs access to your SMS to detect ride bookings.',
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

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'SheRaksha needs access to your location to send ride updates.',
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

  const fetchLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is needed.');
      return;
    }
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        console.log('Location error:', error);
        setLocation(null);
        Alert.alert('Location Error', 'Could not fetch location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleStartRide = async () => {
    if (Platform.OS === 'android') {
      setFetching(true);
      const hasSmsPermission = await requestSmsPermission();
      if (!hasSmsPermission) {
        Alert.alert('Permission Denied', 'SMS read permission is needed.');
        setFetching(false);
        return;
      }
      const filter = {
        box: 'inbox',
        maxCount: 20,
      };

      try {
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail) => {
            console.log('Failed to read SMS:', fail);
            Alert.alert('Error', 'Failed to read SMS. Please check permissions.');
            setFetching(false);
          },
          async (count, smsList) => {
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

              if (rideMsg && rideMsg.body) {
                const vehicleMatch = rideMsg.body.match(/vehicle\s*number\s*[:\-]?\s*([A-Z0-9-]+)/i);
                const driverMatch = rideMsg.body.match(/driver\s*name\s*[:\-]?\s*([A-Za-z\s]+)/i);
                const phoneMatch = rideMsg.body.match(/(\+91\d{10}|\d{10})/);

                setDriverName(driverMatch?.[1]?.trim() ?? 'Not Found');
                setVehicleNumber(vehicleMatch?.[1]?.trim() ?? 'Not Found');
                setDriverPhone(phoneMatch?.[1]?.trim() ?? 'Not Found');

                Alert.alert('Ride Detected', 'Details fetched automatically.');
              } else {
                Alert.alert('No Recent Ride SMS', 'Please check your ride booking SMS.');
              }
            } catch (e) {
              console.error('Parse error:', e);
              Alert.alert('Error', 'Could not parse SMS.');
            } finally {
              setFetching(false);
            }
          }
        );
      } catch (outerErr) {
        console.error('Outer error:', outerErr);
        Alert.alert('Error', 'SMS reading failed.');
        setFetching(false);
      }
    } else {
      Alert.alert('Unsupported', 'SMS reading is only supported on Android.');
    }
  };

  const handleManualSubmit = () => {
    if (!driverName || !vehicleNumber || !driverPhone) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    Alert.alert('Success', 'Details filled manually.');
    setShowManualForm(false);
  };

  return (
    <View style={styles.fullContainer}>
      <LottieView source={require('../assets/homebg.json')} autoPlay loop style={styles.bgLottie} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.menuRow}>
          <Text style={styles.slideText}>Slide it</Text>
          <LottieView source={require('../assets/slide.json')} autoPlay loop style={styles.menuLottie} />
        </View>

        <LottieView source={require('../assets/trusted.json')} autoPlay loop style={styles.middleLottie} />
        <TypeWriter typing={1} maxDelay={100} style={styles.title}>SheRaksha</TypeWriter>
        <TypeWriter typing={1} maxDelay={80} style={styles.subtitle}>You are safe with SheRaksha</TypeWriter>

        <LottieView source={require('../assets/safety.json')} autoPlay loop style={{ width: 120, height: 120, marginBottom: 10 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TypeWriter typing={1} maxDelay={80} style={styles.slogan}>
            Drop the fear at the pickup point
          </TypeWriter>
          <Ionicons name="location" size={28} color="#ff5722" style={{ marginLeft: 8 }} />
        </View>

        <LottieView source={require('../assets/car.json')} autoPlay loop style={styles.topLottie} />

        <TouchableOpacity style={styles.fetchButton} onPress={handleStartRide}>
          <Ionicons name="car" size={18} color="#fff" />
          <Text style={styles.fetchButtonText}> Fetch Latest Ride Details</Text>
        </TouchableOpacity>

        <LottieView source={require('../assets/million.json')} autoPlay loop style={styles.iconLottie} />

        <TouchableOpacity onPress={() => setShowManualForm(!showManualForm)} style={styles.plusButton}>
          <MaterialIcons name="add-circle" size={28} color="#00796b" />
        </TouchableOpacity>

        {showManualForm && (
          <Pressable style={({ pressed }) => [styles.boxWrapper, pressed && styles.boxLift]}>
            <ImageBackground source={require('../assets/image.png')} resizeMode="cover" imageStyle={{ borderRadius: 15, opacity:0.3 }} style={styles.boxBackground}>
              <TextInput style={styles.input} placeholder="Driver Name" value={driverName} onChangeText={setDriverName} />
              <TextInput style={styles.input} placeholder="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} />
              <TextInput style={styles.input} placeholder="Driver Phone" value={driverPhone} onChangeText={setDriverPhone} keyboardType="phone-pad" />
              <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ImageBackground>
          </Pressable>
        )}

        <Pressable style={({ pressed }) => [styles.boxWrapper, pressed && styles.boxLift]}>
          <ImageBackground source={require('../assets/image.png')} resizeMode="cover" imageStyle={{ borderRadius: 15,    opacity:0.3}} style={styles.boxBackground}>
            <Text style={styles.label}>
              <Ionicons name="person" size={18} color="#ff9800" /> Driver Name: <Text style={styles.value}>{driverName || 'Awaiting'}</Text>
            </Text>
            <Text style={styles.label}>
              <Ionicons name="car" size={18} color="#4caf50" /> Vehicle Number: <Text style={styles.value}>{vehicleNumber || 'Awaiting'}</Text>
            </Text>
            <Text style={styles.label}>
              <Ionicons name="call" size={18} color="#2196f3" /> Driver Phone: <Text style={styles.value}>{driverPhone || 'Awaiting'}</Text>
            </Text>
          </ImageBackground>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.boxWrapper, pressed && styles.boxLift]}>
          <ImageBackground source={require('../assets/image.png')} resizeMode="cover" imageStyle={{ borderRadius: 15,    opacity:0.3 }} style={styles.boxBackground}>
            <Text style={styles.contactsTitle}>
              <MaterialIcons name="contacts" size={20} color="#e91e63" /> Emergency Contacts
            </Text>
            {contacts.length ? (
              contacts.map((num, idx) => (
                <Text key={idx} style={styles.contactItem}>
                  <Ionicons name="person" size={16} color="#9c27b0" /> {idx + 1}. {num}
                </Text>
              ))
            ) : (
              <Text style={styles.contactItem}>No contacts saved</Text>
            )}
          </ImageBackground>
        </Pressable>

        
          <TouchableOpacity style={styles.fetchButton} onPress={fetchLocation}>
            <Ionicons name="location" size={18} color="#fff" />
            <Text style={styles.fetchButtonText}> Fetch Current Location</Text>
          </TouchableOpacity>
          <LottieView source={require('../assets/location.json')} autoPlay loop style={{ width: 100, height: 100, marginLeft: 12,marginBottom:10 }} />
        

        {mapRegion && (
          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={mapRegion} showsUserLocation>
              <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title="You are here" description="Current Location" />
            </MapView>
          </View>
        )}

        <TouchableOpacity style={styles.safeButton} onPress={() => Alert.alert('Status', 'Safe status sent.')}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.fetchButtonText}> Mark as Safe</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#eafcff' },
  bgLottie: { ...StyleSheet.absoluteFillObject },
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  menuRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 15 },
  slideText: { color: '#00796b', fontWeight: 'bold', fontSize: 20, fontFamily: 'monospace' },
  menuLottie: { width: 70, height: 70 },
  middleLottie: { width: 140, height: 140, marginBottom: 10 },
  iconLottie: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: '900', color: '#00796b', textAlign: 'center', fontFamily: 'serif' },
  subtitle: { fontSize: 22, color: '#004d40', marginTop: 8, textAlign: 'center', fontStyle: 'italic', fontFamily: 'sans-serif-medium' },
  slogan: { fontSize: 20, color: '#555', marginTop: 10, marginBottom: 10, textAlign: 'center', fontFamily: 'cursive' },
  topLottie: { width: 160, height: 160, marginBottom: 15 },
  fetchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796b',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  fetchButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8, fontFamily: 'sans-serif-condensed' },
  plusButton: { marginBottom: 20 },
  input: {
    backgroundColor: '#f1fefe',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#00796b',
  },
  submitButton: { backgroundColor: '#00796b', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  boxWrapper: { width: '100%', marginBottom: 25, borderRadius: 18 },
  boxLift: {
    transform: [{ translateY: -6 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  boxBackground: {
    padding: 5,
    borderRadius: 18,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  label: { fontSize: 20, color: '#1e1e1e', marginBottom: 10, fontFamily: 'Georgia' },
  value: { fontWeight: '700', color: '#004d40', fontSize: 20, fontFamily: 'Courier New' },
  contactsTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 14, color: '#00796b', fontFamily: 'Palatino' },
  contactItem: { fontSize: 18, color: '#37474f', fontFamily: 'Verdana', marginBottom: 8 },
  mapContainer: {
    elevation: 10,
    width: '100%',
    height: 550,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#2d818cff',
    shadowColor:'#000',
    shadowRadius: 8,
    shadowOffset:{ width: 0, height: 8 },
  },
  map: { flex: 1 },
  safeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796b',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginBottom: 30,
  },
});
