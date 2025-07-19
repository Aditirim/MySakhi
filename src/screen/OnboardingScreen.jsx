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

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleSkip} style={styles.button}>
          <Text style={styles.buttonText}>Skip</Text>
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
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Animation */}
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
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
});

export default OnboardingScreen;
