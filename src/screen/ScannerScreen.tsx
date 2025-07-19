import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../type'; // adjust path
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // adjust path
import type { QRDetailsType } from '../type';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'back') || devices[0];

  useEffect(() => {
    const getPermissions = async () => {
      const permission = await Camera.requestCameraPermission() as string;
      setHasPermission(permission === 'authorized' || permission === 'granted');
    };
    getPermissions();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: async (codes) => {
      for (const code of codes) {
        try {
          const parsed = JSON.parse(code.value ?? '');
          const vehicleNumber = parsed.vehicleNumber;

          if (!vehicleNumber) {
            Alert.alert('Invalid QR Code', 'Missing vehicle number in QR.');
            return;
          }

          const docRef = doc(db, 'QRDetails', vehicleNumber);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as QRDetailsType;
            navigation.navigate('VehicleDetail', { data });
          } else {
            Alert.alert('Not Found', 'Vehicle not found in database.');
          }
        } catch (error) {
          Alert.alert('Invalid QR Code', 'QR must contain valid JSON with vehicleNumber.');
        }
      }
    },
  });

  if (!device || !hasPermission) {
    return (
      <View style={styles.loading}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Scan a QR Code</Text>
      </View>
    </View>
  );
};

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#00000080',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
