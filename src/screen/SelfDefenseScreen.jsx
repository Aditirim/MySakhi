import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SelfDefenseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Self Defense Tips</Text>
      <Text style={styles.text}>Learn safety and self-defense skills to protect yourself.</Text>
    </View>
  );
};

export default SelfDefenseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#d63384' },
  text: { fontSize: 16, textAlign: 'center' },
});
