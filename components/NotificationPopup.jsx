import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class NotificationPopup extends Component {
  render() {
    const { message, onClose, closeText, onAction, actionText } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.notifButton} onPress={onClose}>
            <Text style={styles.notifButtonText}>{closeText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifButton} onPress={onAction}>
            <Text style={styles.notifButtonText}>{actionText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 40,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
  },
  notifButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4d94ff',
    borderRadius: 15,
  },
  notifButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
