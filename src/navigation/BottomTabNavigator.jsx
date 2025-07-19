import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/Homescreen';
import NewsScreen from '../screen/NewsScreen';
import EmergencyScreen from '../screen/EmergencyScreen';
import ChatbotScreen from '../screen/ChatbotScreen';
import SafetyScreen from '../screen/SafetyScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'News':
              iconName = 'newspaper-outline';
              break;
            case 'Emergency':
              iconName = 'alert-circle-outline';
              break;
            case 'Chatbot':
              iconName = 'chatbubble-ellipses-outline';
              break;
            
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00796b',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
