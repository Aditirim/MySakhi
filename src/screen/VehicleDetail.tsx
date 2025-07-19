import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../type'; // Adjust if needed
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path if needed

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleDetail'>;

const VehicleDetailScreen = ({ route }: Props) => {
  const { data } = route.params;
  const navigation = useNavigation();

  const [safeVotes, setSafeVotes] = useState(data.isSafeVotes);
  const [notSafeVotes, setNotSafeVotes] = useState(data.notSafeVotes);

  const handleVote = async (isSafe: boolean) => {
    try {
      const docRef = doc(db, 'QRDetails', data.vehicleNumber);
      await updateDoc(docRef, {
        ...(isSafe ? { isSafeVotes: increment(1) } : { notSafeVotes: increment(1) }),
      });

      if (isSafe) {
        setSafeVotes((prev) => prev + 1);
        Alert.alert('Thank you!', 'You marked the driver as safe.');
      } else {
        setNotSafeVotes((prev) => prev + 1);
        Alert.alert('Thank you!', 'You marked the driver as unsafe.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register your vote. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vehicle Details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Driver Name:</Text>
        <Text style={styles.value}>{data.driverName}</Text>

        <Text style={styles.label}>Vehicle Number:</Text>
        <Text style={styles.value}>{data.vehicleNumber}</Text>

        <Text style={styles.label}>Police Verified:</Text>
        <Text style={styles.value}>{data.policeVerified ? 'Yes' : 'No'}</Text>

        <Text style={styles.label}>Safe Votes:</Text>
        <Text style={styles.value}>{safeVotes}</Text>

        <Text style={styles.label}>Not Safe Votes:</Text>
        <Text style={styles.value}>{notSafeVotes}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.voteButton, { backgroundColor: '#388e3c' }]} onPress={() => handleVote(true)}>
          <Text style={styles.buttonText}>Mark Safe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.voteButton, { backgroundColor: '#d32f2f' }]} onPress={() => handleVote(false)}>
          <Text style={styles.buttonText}>Mark Unsafe</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VehicleDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
  },
  voteButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButton: {
    marginTop: 25,
    backgroundColor: '#00796b',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
