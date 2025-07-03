// src/screens/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to SheRaksha',
    subtitle: 'Your own Suraksha companion',
    image: require('../assets/logo.png'),
  },
  {
    key: '2',
    title: 'Made by Women, for Women',
    subtitle: 'Built for strength, safety & solidarity',
    image: require('../assets/onboard1.jpg'),
  },
  {
    key: '3',
    title: 'Trusted by Millions',
    subtitle: 'Join our growing sisterhood of safety',
    image: require('../assets/onboard2.jpg'),
  },
  {
    key: '4',
    title: 'Drop the Fear at the Pickup Point',
    subtitle: 'Be fearless. Be SheRaksha.',
    image: require('../assets/onboard3.jpg'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const imageScale = useRef(new Animated.Value(0)).current;
  const headingTranslate = useRef(new Animated.Value(-50)).current;
  const headingOpacity = useRef(new Animated.Value(0)).current;

  const triggerAnimation = () => {
    imageScale.setValue(0);
    headingTranslate.setValue(-50);
    headingOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(headingTranslate, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headingOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
      <Animated.Image
        source={require('../assets/heading1.png')}
        style={[
          styles.headingImage,
          {
            transform: [{ translateY: headingTranslate }],
            opacity: headingOpacity,
          },
        ]}
      />

      <Animated.Image
        source={item.image}
        style={[styles.image, { transform: [{ scale: imageScale }] }]}
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
                { backgroundColor: i === currentIndex ? '#4FC3F7' : '#ccc' },
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
          if (index !== currentIndex) {
            setCurrentIndex(index);
            triggerAnimation();
          }
        }}
        onMomentumScrollEnd={triggerAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFEFF',
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
  headingImage: {
    width: width * 0.9,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  image: {
    width: width * 0.9,
    height: height * 0.45,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#0277BD',
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
    backgroundColor: '#4FC3F7',
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
