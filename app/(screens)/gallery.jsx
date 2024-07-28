import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, Modal } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';

const photosData = [
  { id: 'photo1', name: 'Photo 1', image: require('../../assets/images/g1.png'), description: 'Graceful Drifter (common)' },
  { id: 'photo2', name: 'Photo 2', image: require('../../assets/images/g2.png'), description: 'Daylight (common)' },
  { id: 'photo3', name: 'Photo 3', image: require('../../assets/images/g3.png'), description: 'Underwater Skyscrapers (common)' },
  { id: 'photo4', name: 'Photo 4', image: require('../../assets/images/g4.png'), description: 'Free as a Bird (common)' },
  { id: 'photo5', name: 'Photo 5', image: require('../../assets/images/g5.png'), description: 'A good ride home! (uncommon)' },
  { id: 'photo6', name: 'Photo 6', image: require('../../assets/images/g6.png'), description: 'CLOSE ENCOUNTER (uncommon)' },
  { id: 'photo7', name: 'Photo 7', image: require('../../assets/images/g7.png'), description: 'Lunch Break (uncommon)' },
  { id: 'photo8', name: 'Photo 8', image: require('../../assets/images/g8.png'), description: 'Playful Pod (Rare)' },
  { id: 'photo9', name: 'Photo 9', image: require('../../assets/images/g9.png'), description: 'Majestic Glow (Rare)' },
  { id: 'photo10', name: 'Photo 10', image: require('../../assets/images/g10.png'), description: 'Golden Paradise (Legendary)'  },
];

const PhotoGallery = () => {
  const [unlockedPictures, setUnlockedPictures] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchUnlockedPictures = async (user) => {
    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      setUnlockedPictures(userSnapshot.data().unlockedPictures || []);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchUnlockedPictures(user);
      } else {
        setUnlockedPictures([]);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handlePhotoPress = async (photo) => {
    if (!unlockedPictures.includes(photo.name)) {
      Alert.alert('Photo is locked', 'You have not unlocked this photo yet.');
    } else {
      setSelectedPhoto(photo);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Photo Gallery</Text>
        <ScrollView contentContainerStyle={styles.gallery}>
          {photosData.map((photo) => (
            <TouchableOpacity key={photo.id} style={styles.pictureItem} onPress={() => handlePhotoPress(photo)}>
              {unlockedPictures.includes(photo.name) ? (
                <Image source={photo.image} style={styles.pictureImage} />
              ) : (
                <Image source={require('../../assets/images/question_mark.png')} style={styles.pictureImage} />
              )}
              <Text style={styles.pictureName}>{photo.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <BackButton style={styles.backButton} />

      {selectedPhoto && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={true}
          onRequestClose={() => setSelectedPhoto(null)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalContent} onPress={() => setSelectedPhoto(null)}>
              <Image source={selectedPhoto.image} style={styles.modalImage} resizeMode="contain" />
              <Text style={styles.modalTitle}>{selectedPhoto.name}</Text>
              <Text style={styles.modalDescription}>{selectedPhoto.description}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 40,
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
    color: '#fff',
    marginBottom: 40,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  pictureItem: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 20,
  },
  pictureImage: {
    width: 164,
    height: 236,
    marginBottom: 10,
  },
  pictureName: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
    marginBottom: 0,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    color: 'white',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});

export default PhotoGallery;
