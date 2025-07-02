import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Trusted by millions',
    description: 'of people part of one part',
    image: require('../assets/on1.png'),
  },
  {
    id: '2',
    title: 'Stay Update',
    description: 'and track your own safety',
    image: require('../assets/on2.png'),
  },
  {
    id: '3',
    title: 'Be Safe',
    description: 'from anywhere in the world',
    image: require('../assets/on3.png'),
  },
];

const OnboardingScreen = (props) => {
  const { navigation } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null); // ✅ Step 1: Create ref

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      swiperRef.current.scrollToIndex({ index: nextIndex }); // ✅ Step 2: Scroll programmatically
      setCurrentIndex(nextIndex);
    } else {
      navigation.replace('SigninScreen');
    }
  };

  return (
    <ImageBackground source={require('../assets/bg.jpg')} style={styles.bg}>
      <SwiperFlatList
        ref={swiperRef} // ✅ Step 3: Attach ref
        index={0}
        onChangeIndex={({ index }) => setCurrentIndex(index)}
        data={onboardingData}
        horizontal
        paginationActiveColor="#d63384"
        paginationDefaultColor="#aaa"
        showPagination
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.description}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginBottom: 80,
  },
  image: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    backgroundColor: '#d63384',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
