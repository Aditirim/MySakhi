import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeaturesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Features</Text>
      <Text style={styles.text}>Explore all the features SheSafe offers for your safety.</Text>
    </View>
  );
};

export default FeaturesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#d63384' },
  text: { fontSize: 16, textAlign: 'center' },
});
