import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const {width, height } = Dimensions.get('window');
const { Value, timing } = Animated;

export default class NotificationPopup extends Component {
  render() {
    const { visible, message, onClose, closeText, onAction, actionText } = this.props;
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
              <TouchableOpacity style={styles.notifButton} onPress={onAction}>
                <Text style={styles.notifButtonText}>{actionText}</Text>
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
    //flexDirection: 'row',
    backgroundColor: 'rgba(144, 205, 248, 0.8)',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily:'PlayfairDisplay',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    width: '100%',
    marginTop: 10,
  },
  notifButton: {
    flex: 1,
    marginHorizontal: 10,
    //marginBottom: 10,
    //paddingVertical: 2,
    //paddingHorizontal: 5,
    padding: 8,
    backgroundColor: '#0967a8',
    borderRadius: 5,
    alignItems: 'center',
  },
  notifButtonText: {
    fontFamily:'PlayfairDisplay',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});
