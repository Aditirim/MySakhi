import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screen/ProfileScreen';
import ScannerScreen from '../screen/ScannerScreen';
import VehicleDetail from '../screen/VehicleDetail';
import CustomDrawerContent from '../screen/CustomDrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

// Main App Stack
const MainAppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: () => (
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00796b', textAlign: 'center' }}>
            SheRaksha
          </Text>
        ),
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={25} color="#000" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Ionicons name="scan-outline" size={25} color="#000" />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
    </Stack.Navigator>
  );
};

export default MainAppStack;
