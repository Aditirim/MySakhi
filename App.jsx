import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from './src/screen/Loginscreen';
import Signinscreen from './src/screen/Signinscreen';
import Homescreen from './src/screen/Homescreen';
const Stack=createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Loginscreen" component={Loginscreen}/>
        <Stack.Screen name="Signinscreen" component={Signinscreen}/>
        <Stack.Screen name="Homescreen" component={Homescreen} options={{ gestureEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})