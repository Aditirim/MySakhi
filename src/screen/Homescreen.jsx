import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const features = [
  { name: 'News', route: 'News' },
  { name: 'Features', route: 'Features' },
  { name: 'Self Ride', route: 'SelfRide' },
  { name: 'Self Defense', route: 'SelfDefense' },
  { name: 'Legal Rights', route: 'LegalRights' },
  { name: 'Community', route: 'Community' },
];

const Homescreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SheSafe User</Text>

      {/* Grid of 2x3 */}
      <View style={styles.grid}>
        {features.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.box}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.emoji}>🧩</Text>
            <Text style={styles.boxText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Full-width last box */}
      <TouchableOpacity
        style={styles.fullBox}
        onPress={() => navigation.navigate('AI')}
      >
        <Text style={styles.emoji}>🤖</Text>
        <Text style={styles.boxText}>AI Sheli</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    paddingVertical: 24,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#339af0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullBox: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    paddingVertical: 24,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#339af0',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
