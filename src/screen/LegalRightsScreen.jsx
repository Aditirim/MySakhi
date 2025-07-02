import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LegalRightsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Know Your Rights</Text>
      <Text style={styles.text}>Understand your legal rights and protections.</Text>
    </View>
  );
};

export default LegalRightsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#d63384' },
  text: { fontSize: 16, textAlign: 'center' },
});
