import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

const AISheliScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hi 👋, I’m Sheli! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    const reply = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: `You said: "${input}". I'm still learning, but I’ll help where I can!`,
    };

    setMessages((prev) => [...prev, userMessage, reply]);
    setInput('');
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>👩‍💻 Sheli - Your AI Safety Assistant</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Ask Sheli something..."
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AISheliScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  header: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  chatArea: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    maxWidth: '80%',
  },
  aiBubble: {
    backgroundColor: '#334155',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#f97316',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0f172a',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#f97316',
    marginLeft: 8,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
