import React, { useEffect, useState } from 'react';
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

  const fetchLatestNews = async () => {
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=women%20safety&language=en&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      setLatestNews(res.data.articles || []);
    } catch (err) {
      console.error('Category news error:', err.message);

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>SheSafe: Women Safety News</Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search women-related news..."
          placeholderTextColor="#aaa"
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
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={categoryNews}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f97316',
    textAlign: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subHeader: {
    color: '#fcd34d',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    marginBottom: 16,
    marginRight: 12,
    overflow: 'hidden',
    width: 280,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#94a3b8',
  },
  tabBar: {
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#334155',
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#f97316',
  },
  tabText: {
    color: '#ccc',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
