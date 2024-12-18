import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageCard = ({ message }) => (
  <View style={styles.card}>
    <Text style={styles.messageText}>{message.text}</Text>
    <Text style={styles.dateText}>{new Date(message.createdAt).toLocaleString()}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  messageText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default MessageCard;
