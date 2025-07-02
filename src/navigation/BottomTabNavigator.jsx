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
            case 'Safety':
              iconName = 'shield-checkmark-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#d63384',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Safety" component={SafetyScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
