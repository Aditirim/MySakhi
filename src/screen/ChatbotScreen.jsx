import React from 'react';
import { WebView } from 'react-native-webview';

export default function ChatbotScreen() {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ uri: 'file:///android_asset/bot.html' }}
      style={{ flex: 1 }}
    />
  );
}
