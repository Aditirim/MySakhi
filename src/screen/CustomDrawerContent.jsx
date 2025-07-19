import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.menuTitle}>Menu</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="language-outline" size={22} color="#2f855a" />
        <Text style={styles.menuText}>Language change</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="share-social-outline" size={22} color="#d97706" />
        <Text style={styles.menuText}>Share app link</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <MaterialIcons name="help-outline" size={22} color="#b91c1c" />
        <Text style={styles.menuText}>FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="shield-checkmark-outline" size={22} color="#f59e0b" />
        <Text style={styles.menuText}>Privacy policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <FontAwesome5 name="file-contract" size={20} color="#eab308" />
        <Text style={styles.menuText}>Terms of use</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="settings-outline" size={22} color="#2563eb" />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="information-circle-outline" size={22} color="#0ea5e9" />
        <Text style={styles.menuText}>About us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="call-outline" size={22} color="#dc2626" />
        <Text style={styles.menuText}>Contact us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="log-out-outline" size={22} color="#6b7280" />
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#8acdd8ff', 
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    marginLeft: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2e2e2e',
  },
});
export default CustomDrawerContent;