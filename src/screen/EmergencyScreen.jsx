import React, { useEffect, useRef, useState,useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Vibration,
  Animated,
  PermissionsAndroid,
  NativeModules,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import SmsAndroid from 'react-native-get-sms-android';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { startLiveLocationTracking } from '../utils/LiveLocationService';
import RNShake from 'react-native-shake';
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'; 


const { AutoCall, AutoSMS } = NativeModules;
const { width } = Dimensions.get('window');

const EmergencyScreen = () => {
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const [isHoldingSOS, setIsHoldingSOS] = useState(false);
  const sosProgress = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(null);
  const [safetyMode, setSafetyMode] = useState('');
const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed[0]?.phone !== undefined) {
            setContacts(parsed);
          }
        } catch {
          setContacts([{ name: '', phone: '' }]);
        }
      }
    };
    loadContacts();
  }, []);
    useEffect(() => {
    const subscription = RNShake.addListener(() => {
      ToastAndroid.show('Shake detected! Sending SOS...', ToastAndroid.SHORT);
      triggerSOS();
    });

    return () => {
      subscription.remove();
    };
  }, [contacts]);

useFocusEffect(
  useCallback(() => {
    const fetchSafetyPreferences = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setSafetyMode(data?.safetyMode ?? '');
          setCustomMessage(data?.customMessage ?? '');
        }
      }
    };

    fetchSafetyPreferences();
  }, [])
);

  const saveContacts = async () => {
    const validContacts = contacts.filter(
      (c) => c.name.trim() !== '' && /^\d{10}$/.test(c.phone.trim())
    );
    await AsyncStorage.setItem('emergencyContacts', JSON.stringify(validContacts));
    setContacts(validContacts.length ? validContacts : [{ name: '', phone: '' }]);
    Alert.alert('Contacts Saved', `${validContacts.length} contact(s) saved.`);
  };

  const requestPermissions = async () => {
    try {
      const callGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
      const smsGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS);
      const readSmsGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
      const locGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return callGranted === 'granted' && smsGranted === 'granted' && readSmsGranted === 'granted' && locGranted === 'granted';
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
            const rideMsg = messages.find((msg) =>
              ['ola', 'uber', 'rapido'].some((word) => msg.body.toLowerCase().includes(word))
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
              resolve({ driverName: 'No..', vehicleNumber: 'No..', driverPhone: 'No' });
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
    if (!permsGranted) return Alert.alert('Permissions Denied', 'All permissions are required.');

    const coords = await getLocation();
    const rideDetails = await readRideDetailsFromSMS();
    Vibration.vibrate([500, 500, 500]);

    const validContacts = contacts
      .filter((c) => c.phone && /^\d{10}$/.test(c.phone))
      .map((c) => c.phone);

    const locText = coords
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : 'Location not available';

    let phoneNumber = null;
    const user = auth().currentUser;
    if (user) {
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      phoneNumber = userDoc.exists ? userDoc.data()?.phone : user.phoneNumber;
    }

    const trackingURL = phoneNumber
      ? `https://mysakhi.web.app/?phone=${phoneNumber}`
      : 'Tracking URL Unavailable';

    
    let customMsg = '';
    try {
      const pref = await AsyncStorage.getItem('sosPreferences');
      if (pref) {
        const parsed = JSON.parse(pref);
        customMsg = parsed.message || '';
        console.log('✅ Custom SOS Message:', customMsg);
      }
    } catch (e) {
      console.log('⚠️ Failed to read sosPreferences:', e);
    }


    const message =   safetyMode === 'Ride' && customMessage?.trim() !== ''? `Mode:${safetyMode}\n${customMessage}\nHelp Me!!\n${locText}\nDriv: ${rideDetails.driverName}\nVech: ${rideDetails.vehicleNumber}\nMOB:${rideDetails.driverPhone}\nLive: ${trackingURL}` : `Mode: ${safetyMode}\n${customMessage}\nHelp! ${locText}\nLive: ${trackingURL}`;
    
    console.log("message length",message.length)
    for (const number of validContacts) {
      try {
        await AutoSMS.sendSMS(number, message);
      } catch (e) {
        console.error(`❌ Failed to send SMS to ${number}:`, e);
      }
    }

       const callContact = async (index) => {
      if (index >= validContacts.length) return;
      try {
        await AutoCall.makeCall(validContacts[index]);
      } catch (e) {
        console.error(`❌ Call failed to ${validContacts[index]}:`, e);
      }
      setTimeout(() => callContact(index + 1), 5000);
    };
    callContact(0);

    if (phoneNumber) startLiveLocationTracking(phoneNumber);

    Alert.alert('✅ SOS Sent', 'Emergency alerts sent to contacts.');
  } catch (e) {
    console.error('🚨 SOS ERROR:', e);
    Alert.alert('Error', 'Something went wrong during SOS.');
  }
};

  const handleLongPress = () => {
    setIsHoldingSOS(true);
    Vibration.vibrate(50);
    Animated.timing(sosProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        triggerSOS();
        resetHold();
      }
    });
  };

  const cancelLongPress = () => {
    setIsHoldingSOS(false);
    Animated.timing(sosProgress).stop();
    sosProgress.setValue(0);
  };

  const resetHold = () => {
    setIsHoldingSOS(false);
    sosProgress.setValue(0);
  };

  const sosWidth = sosProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 125] });

  return (
    <View style={styles.fullScreen}>
      <LottieView source={require('../assets/homebg.json')} autoPlay loop style={StyleSheet.absoluteFill} resizeMode="cover" ref={backgroundAnim} />
      <ScrollView contentContainerStyle={styles.overlay}>
        <LottieView source={require('../assets/danger.json')} autoPlay loop style={styles.headerAnimation} />
        <Text style={styles.mainHeading}>Are you in Danger<Text style={{ color: '#ef1e1e', fontSize: 36 }}>?</Text></Text>
        <Text style={styles.subHeading}>Save your contacts and alert them in emergencies</Text>

       

        {contacts.map((contact, index) => (
  <View key={index} style={styles.contactCard}>
    <View style={styles.contactCardHeader}>
      <Text style={styles.contactLabel}>Emergency Contact {index + 1}</Text>
      {contacts.length > 1 && (
        <TouchableOpacity
          onPress={() =>
            setContacts(contacts.filter((_, i) => i !== index))
          }
          style={styles.deleteIconBtn}
        >
          <Icon name="delete" size={22} color="#b71c1c" />
        </TouchableOpacity>
      )}
    </View>

    <TextInput
      style={styles.contactInput}
      placeholder="Full Name (e.g., Mom)"
      placeholderTextColor="#187e72ff"
      value={contact.name}
      onChangeText={(text) =>
        setContacts(contacts.map((c, i) => (i === index ? { ...c, name: text } : c)))
      }
    />
    <TextInput
      style={styles.contactInput}
      placeholder="Phone Number (10 digits)"
      placeholderTextColor="#197066ff"
      keyboardType="phone-pad"
      maxLength={10}
      value={contact.phone}
      onChangeText={(text) =>
        setContacts(contacts.map((c, i) => (i === index ? { ...c, phone: text } : c)))
      }
    />
  </View>
))}


        {contacts.length < 3 && (
          <TouchableWithoutFeedback onPress={() => setContacts([...contacts, { name: '', phone: '' }])}>
      <View style={styles.addBtn}>
        <Icon name="add" size={22} color="#fff" />
        <Text style={styles.addText}>Add Contact</Text>
      </View>
          </TouchableWithoutFeedback>
        )}

        <TouchableWithoutFeedback onPress={saveContacts}>
          <View style={styles.saveBtn}><Text style={styles.saveText}>Save Contacts</Text></View>
        </TouchableWithoutFeedback>
      <Text style={{ fontSize: 16, color: '#ffffffee', marginBottom: 10 }}>
        Selected Mode: <Text style={{ fontWeight: 'bold', color: '#00f7f7' ,fontSize:18 }}>{safetyMode || 'None'}</Text>
      </Text>

        <View style={styles.sosContainer}>
          <TouchableWithoutFeedback onPressIn={handleLongPress} onPressOut={cancelLongPress}>
            <View style={styles.lottieWrapper}>
              <LottieView source={require('../assets/sos.json')} autoPlay loop style={styles.actionButton} />
              {isHoldingSOS && <View style={styles.horizontalTank}><Animated.View style={[styles.fillBar, { width: sosWidth }]} /></View>}
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.sosHintText}>{isHoldingSOS ? 'Holding...' : 'Hold to Activate SOS'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  fullScreen: {
     flex: 1,
     backgroundColor: '#000'
  },
  overlay: { 
    flexGrow: 1,
    padding: 24,
    alignItems: 'center'
  },
  headerAnimation: {
    width: 200,
    height: 200,
    marginBottom: 10
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  subHeading: {
    fontSize: 16,
    color: '#cadbd9ff',
    marginBottom: 25,
    textAlign: 'center'
  },
  contactCard: {
    backgroundColor: '#ffffff2d',
    borderRadius: 12, padding: 16,
    marginBottom: 30, width: '100%',
    borderWidth: 1,
    borderColor:'#ffffff30',
    position: 'relative'
  },
  contactLabel: {
    color: '#fff',
    marginBottom: 6, 
    fontWeight: 'bold',
    fontSize: 16 },
  contactInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 11,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    color: '#000'
  },
   contactCardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
},
deleteIconBtn: {
  backgroundColor: '#fff1f1',
  padding: 6,
  borderRadius: 6,
},
addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16 
  },
addBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#16549bff',
  padding: 10,
  borderRadius: 8,
  marginBottom: 16,
  width: '55%',
  gap: 6, 
},
saveBtn: {
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '60%' },
  saveText: {
    color: '#fff',
     textAlign: 'center',
     fontWeight: 'bold',
     fontSize: 18 },
  sosContainer: {
    alignItems: 'center',
    marginVertical: 25
  },
  lottieWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    width: 150,
    height: 150
  },
  horizontalTank: {
    width: 130,
    height: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff60',
    backgroundColor: '#ffffffdf',
    overflow: 'hidden',
    marginTop: 10,
    alignSelf: 'center'
   },
  fillBar: {
    height: '100%',
    backgroundColor: '#4fc3f7',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20
  },
  sosHintText: {
    marginTop: 10,
    fontSize: 15,
    color: '#ccc'
  },
});


