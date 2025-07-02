import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from './src/screen/OnboardingScreen';
import SigninScreen from './src/screen/SigninScreen';
import SignupScreen from './src/screen/SignupScreen';
import Homescreen from './src/screen/Homescreen';
import NewsScreen from './src/screen/NewsScreen';
import FeaturesScreen from './src/screen/FeaturesScreen';
import SelfRideScreen from './src/screen/SelfRideScreen';
import SelfDefenseScreen from './src/screen/SelfDefenseScreen';
import LegalRightsScreen from './src/screen/LegalRightsScreen';
import CommunityScreen from './src/screen/CommunityScreen';
import AISheliScreen from './src/screen/AISheliScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="OnboardingScreen"  screenOptions={{ headerShown: false }} >
         <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
  <Stack.Screen name="SigninScreen" component={SigninScreen} />
  <Stack.Screen name="SignupScreen" component={SignupScreen} />
 
        <Stack.Screen name="Homescreen" component={Homescreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Features" component={FeaturesScreen} />
        <Stack.Screen name="SelfRide" component={SelfRideScreen} />
        <Stack.Screen name="SelfDefense" component={SelfDefenseScreen} />
        <Stack.Screen name="LegalRights" component={LegalRightsScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="AI" component={AISheliScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
