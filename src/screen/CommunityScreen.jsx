import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommunityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Reports</Text>
      <Text style={styles.text}>Connect with others and share local incidents.</Text>
    </View>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#d63384' },
  text: { fontSize: 16, textAlign: 'center' },
});
