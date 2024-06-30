import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';

const { width, height } = Dimensions.get('window');

export default class NotificationPopup extends Component {
  render() {
    const { visible, message, onClose, closeText } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.popup}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.notifButton} onPress={onClose}>
                <Text style={styles.notifButtonText}>{closeText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    backgroundColor: 'rgba(144, 205, 248, 0.8)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  message: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  notifButton: {
    marginHorizontal: 10,
    padding: 8,
    backgroundColor: '#0967a8',
    borderRadius: 5,
    alignItems: 'center',
  },
  notifButtonText: {
    fontFamily: 'PlayfairDisplay',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});
