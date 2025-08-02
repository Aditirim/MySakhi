import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const API_KEY = '1941785aca1f4a05b6f700aa5fd28887';

const categories = [
  'Safety',
  'Self Defense',
  'Legal Rights',
  'Crime',
  'Education',
  'Awareness',
];

const NewsScreen = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [categoryNews, setCategoryNews] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Safety');
  const backgroundAnim = useRef(null);

  const fetchLatestNews = async () => {
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=women%20safety&language=en&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      setLatestNews(res.data.articles || []);
    } catch (err) {
      console.error('Latest news error:', err.message);
    }
  };

  const fetchCategoryNews = async (category) => {
    setLoading(true);
    try {
      const query = `women ${category}`;
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&language=en&pageSize=10&apiKey=${API_KEY}`
      );
      setCategoryNews(res.data.articles || []);
    } catch (err) {
      console.error('Category news error:', err.message);
      setCategoryNews([]);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (search.trim()) {
      setSelectedCategory('');
      fetchCategoryNews(`women ${search}`);
    }
  };

  useEffect(() => {
    fetchLatestNews();
    fetchCategoryNews(selectedCategory);
  }, [selectedCategory]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.url)}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.publishedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor:'#000'}}>
      {/* Background Lottie animation */}
      <LottieView
        source={require('../assets/homebg.json')}
        autoPlay
        loop
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        ref={backgroundAnim}
      />

      {/* Main Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.header}> Women Safety News</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search women-related news..."
            placeholderTextColor="#4f4f4f"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Latest News */}
        <Text style={styles.subHeader}>Latest News</Text>
        <FlatList
          horizontal
          data={latestNews}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
        >
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.tab,
                selectedCategory === cat && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === cat && styles.activeTabText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category or Search Results */}
        <Text style={styles.subHeader}>
          {selectedCategory ? `Women - ${selectedCategory}` : `Search: "${search}"`}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#00695c" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={categoryNews}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Keep it transparent to show Lottie
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#01aa96ff',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#d6f4f2',
    padding: 10,
    borderRadius: 10,
    color: '#00695c',
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#01aa96ff',
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subHeader: {
    color: '#01aa96ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 18,
    marginRight: 14,
    overflow: 'hidden',
    width: 280,
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00695c',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: '#4f4f4f',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#7c7c7c',
  },
  tabBar: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#d6f4f2',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  activeTab: {
    backgroundColor: '#00695c',
    borderColor: '#00695c',
  },
  tabText: {
    color: '#00695c',
    fontSize: 14,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
