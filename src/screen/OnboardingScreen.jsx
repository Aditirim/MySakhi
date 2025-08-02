import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 


const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to SheRaksha',
    subtitle: 'Your own Suraksha companion',
    lottie: require('../assets/car.json'),
  },
  {
    key: '2',
    title: 'Made by Women, for Women',
    subtitle: 'Built for strength, safety & solidarity',
    lottie: require('../assets/million.json'),
  },
  {
    key: '3',
    title: 'Trusted by Millions',
    subtitle: 'Join our growing sisterhood of safety',
    lottie: require('../assets/trusted.json'),
  },
  {
    key: '4',
    title: 'Drop the Fear at the Pickup Point',
    subtitle: 'Be fearless. Be SheRaksha.',
    lottie: require('../assets/cab.json'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('LoginScreen');
    }
  };

  const handleSkip = () => {
    navigation.replace('LoginScreen');
  };




const renderItem = ({ item }) => (
  <View style={styles.slide}>
    <LottieView
      source={item.lottie}
      autoPlay
      loop
      style={styles.centerAnimation}
    />
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.subtitle}>{item.subtitle}</Text>
  </View>
);


  return (
    <View style={styles.container}>
      
      <LottieView
        source={require('../assets/homebg.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {currentIndex === slides.length - 1 ? (
  <View style={styles.getStartedContainer}>
    <TouchableOpacity
      onPress={() => navigation.replace('LoginScreen')}
      style={styles.getStartedButton}
    >
      <Text style={styles.getStartedText}>Get Started</Text>
      <Ionicons name="rocket-outline" size={20} color="#fff" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.buttonRow}>
    <TouchableOpacity onPress={handleSkip} style={styles.button}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>Skip</Text>
        <Ionicons
          name="play-skip-forward-outline"
          size={18}
          color="#fff"
          style={{ marginLeft: 6 }}
        />
      </View>
    </TouchableOpacity>

    <View style={styles.dotsContainer}>
      {slides.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i === currentIndex ? '#00796b' : '#ccc' },
          ]}
        />
      ))}
    </View>

    <TouchableOpacity onPress={handleNext} style={styles.button}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>Next</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={19}
          color="#fff"
          style={{ marginLeft: 6 }}
        />
      </View>
    </TouchableOpacity>
  </View>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafcff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  centerAnimation: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#00796b',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom:100,
  },

  buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

  button: {
  backgroundColor: '#00796b',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 5,
},

   buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },


  getStartedContainer: {
  position: 'absolute',
  bottom: 40,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
},

getStartedButton: {
  flexDirection: 'row',
  backgroundColor: '#00796b',
  paddingVertical: 14,
  paddingHorizontal: 30,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 5,
  marginBottom:25,
  
},

getStartedText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});

export default OnboardingScreen;
