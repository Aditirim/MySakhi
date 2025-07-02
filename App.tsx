import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/Loginscreen';
import SignupScreen from './src/screen/Signinscreen';
import MainAppStack from './src/navigation/MainStack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loginscreen" component={LoginScreen} />
        <Stack.Screen name="Signinscreen" component={SignupScreen} />
        <Stack.Screen name="MainApp" component={MainAppStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
