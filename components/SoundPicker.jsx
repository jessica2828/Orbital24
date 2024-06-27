import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const sounds = [
  { id: '1', name: 'Study', file: require('@/assets/music/lofi-study.mp3') },
  { id: '2', name: 'Home', file: require('@/assets/music/home.mp3') },
  { id: '3', name: 'Kalimba', file: require('@/assets/music/kalimba.mp3') },
  { id: '4', name: 'Relax', file: require('@/assets/music/loop.mp3') },
  { id: '5', name: 'Night Street', file: require('@/assets/music/night-street.mp3') },
  { id: '6', name: 'Ocean Breeze', file: require('@/assets/music/ocean-breeze.mp3') },
  { id: '7', name: 'Piano 1', file: require('@/assets/music/piano-1.mp3') },
  { id: '8', name: 'Piano 2', file: require('@/assets/music/piano-2.mp3') },
];

export default function SoundPicker({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select a sound:</Text>
          <FlatList
            data={sounds}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.soundOption} onPress={() => onSelect(item)}>
                <Text style={styles.soundText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  soundOption: {
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
  },
  soundText: {
    fontSize: 18,
    color: 'white',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0967a8',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
