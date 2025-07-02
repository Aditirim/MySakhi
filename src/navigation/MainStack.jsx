import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screen/ProfileScreen';
import ScannerScreen from '../screen/ScannerScreen';
import VehicleDetail from '../screen/VehicleDetail'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const MainAppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={BottomTabNavigator}
        options={({ navigation }) => ({
          headerTitle: 'SheSafe',
          headerRight: () => (
            <>
              <Ionicons
                name="person-circle-outline"
                size={26}
                color="#d63384"
                style={{ marginRight: 16 }}
                onPress={() => navigation.navigate('Profile')}
              />
              <Ionicons
                name="scan-outline"
                size={26}
                color="#d63384"
                style={{ marginRight: 16 }}
                onPress={() => navigation.navigate('Scanner')}
              />
            </>
          ),
        })}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
    </Stack.Navigator>
  );
};

export default MainAppStack;
