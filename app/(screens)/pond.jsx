import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, ImageBackground, Alert, Button } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import BackButton from '@/components/BackButton';

const companionsData = [
  { id: 1, name: 'Orange Loaf', image: require('../../assets/images/c1.png'), costumes: { default: require('../../assets/images/c1.png'), grass_skirt: require('../../assets/images/c1_grass.png'), goggles: require('../../assets/images/c1_gog.png') } },
  { id: 2, name: 'Gray Loaf', image: require('../../assets/images/c2.png'), costumes: { default: require('../../assets/images/c2.png'), grass_skirt: require('../../assets/images/c2_grass.png'), goggles: require('../../assets/images/c2_gog.png') } },
  { id: 3, name: 'Blue Loaf', image: require('../../assets/images/c3.png'), costumes: { default: require('../../assets/images/c3.png'), grass_skirt: require('../../assets/images/c3_grass.png'), goggles: require('../../assets/images/c3_gog.png') } },
  { id: 4, name: 'Lionfish Cat', image: require('../../assets/images/c4.png'), costumes: { default: require('../../assets/images/c4.png'), grass_skirt: require('../../assets/images/c4_grass.png'), goggles: require('../../assets/images/c4_gog.png') } },
  { id: 5, name: 'Goldfish Cat', image: require('../../assets/images/c5.png'), costumes: { default: require('../../assets/images/c5.png'), grass_skirt: require('../../assets/images/c5_grass.png'), goggles: require('../../assets/images/c5_gog.png') } },
  { id: 6, name: 'Shrimp Cat', image: require('../../assets/images/c6.png'), costumes: { default: require('../../assets/images/c6.png'), grass_skirt: require('../../assets/images/c6_grass.png'), goggles: require('../../assets/images/c6_gog.png') } },
  { id: 7, name: '"Normal" Cat', image: require('../../assets/images/c7.png'), costumes: { default: require('../../assets/images/c7.png'), grass_skirt: require('../../assets/images/c7_grass.png'), goggles: require('../../assets/images/c7_gog.png') } }
];

const customizationItemsData = [
  { id: 'grass_skirt', name: 'Grass Skirt', image: require('../../assets/images/grass_skirt.png') },
  { id: 'goggles', name: 'Goggles', image: require('../../assets/images/goggles.png') },
];

const DEFAULT_UNLOCKED_COMPANIONS = [1]; // Default to Companion 1 unlocked

const Companions = () => {
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [customizationItems, setCustomizationItems] = useState([]);
  const [unlockedCompanions, setUnlockedCompanions] = useState([]);
  const [currentCustomizations, setCurrentCustomizations] = useState({});
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [newlyUnlockedCompanions, setNewlyUnlockedCompanions] = useState([]);

  const fetchCompanions = async (user) => {
    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      const unlocked = data.unlockedCompanions || DEFAULT_UNLOCKED_COMPANIONS;
      setUnlockedCompanions(unlocked);
      setCustomizationItems(data.customizationItems || []);
      setCurrentCustomizations(data.currentCustomizations || {});
      setPurchasedItems(data.purchasedItems || []);
      setNewlyUnlockedCompanions(data.newlyUnlockedCompanions || []);

      // update Firestore if this is the first time the user data is loaded
      if (!data.unlockedCompanions) {
        await updateDoc(userDoc, { unlockedCompanions: DEFAULT_UNLOCKED_COMPANIONS });
      }
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchCompanions(user);
      } else {
        setUnlockedCompanions([]);
        setCustomizationItems([]);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleCompanionPress = async (companion) => {
    if (unlockedCompanions.includes(companion.id)) {
      setSelectedCompanion(companion);
      const updatedNewlyUnlockedCompanions = newlyUnlockedCompanions.filter(id => id !== companion.id);
      setNewlyUnlockedCompanions(updatedNewlyUnlockedCompanions);

      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
        await updateDoc(userDoc, { newlyUnlockedCompanions: updatedNewlyUnlockedCompanions });
      }
    } else {
      Alert.alert('Companion is locked', 'You have not unlocked this companion yet.');
    }
  };

  const handleCustomize = async (item) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
      await updateDoc(userDoc, {
        currentCustomizations: { ...currentCustomizations, [selectedCompanion.id]: item.id },
      });
      setCurrentCustomizations({ ...currentCustomizations, [selectedCompanion.id]: item.id });
      Alert.alert('Customization Applied', `You have customized ${selectedCompanion.name} with ${item.name}`);
      setSelectedCompanion(null);
    } else {
      Alert.alert('No user is signed in');
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Companions</Text>
        <ScrollView contentContainerStyle={styles.gallery}>
        {companionsData.map((companion) => (
            <TouchableOpacity key={companion.id} style={styles.companion} onPress={() => handleCompanionPress(companion)}>
                {unlockedCompanions.includes(companion.id) ? (
                    <Image source={companion.costumes[currentCustomizations[companion.id] || 'default']} style={styles.companionImage} />
                ) : (
                    <Image source={require('../../assets/images/question_mark.png')} style={styles.companionImage} />
                )}
                <Text style={styles.companionName}>{companion.name}</Text>
                {newlyUnlockedCompanions.includes(companion.id) && (
                  <Text style={styles.newReward}>New!</Text>
                )}
            </TouchableOpacity>
        ))}
        </ScrollView>
      </View>
      <Modal visible={!!selectedCompanion} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCompanion && (
              <>
                <Text style={styles.availableCostumesText}>Available Costumes</Text>
                <ScrollView horizontal contentContainerStyle={styles.costumeScroll}>
                  <View style={styles.costumeItem}>
                    <Image source={selectedCompanion.costumes.default} style={styles.costumeImage} />
                    {(!currentCustomizations[selectedCompanion.id] || currentCustomizations[selectedCompanion.id] === 'default') && (
                      <Text style={styles.inUseStamp}>In Use</Text>
                    )}
                    <Button title="Default" onPress={() => handleCustomize({ id: 'default', name: 'Default', image: selectedCompanion.costumes.default })} />
                  </View>
                  {customizationItemsData.map((item) => (
                    <View key={item.id} style={styles.costumeItem}>
                      <Image source={purchasedItems.includes(item.id) ? selectedCompanion.costumes[item.id] : require('../../assets/images/question_mark.png')} style={styles.costumeImage} />
                      {currentCustomizations[selectedCompanion.id] === item.id && (
                        <Text style={styles.inUseStamp}>In Use</Text>
                      )}
                      {purchasedItems.includes(item.id) && (
                        <Button title={item.name} onPress={() => handleCustomize(item)} />
                      )}
                    </View>
                  ))}
                </ScrollView>
                <Button title="Close" onPress={() => setSelectedCompanion(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>
      <BackButton style={styles.backButton} />
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
  companion: {
    width: '60%',
    alignItems: 'center',
    marginBottom: 20,
  },
  companionImage: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  companionName: {
    fontSize: 25,
    fontFamily: 'PlayfairDisplay',
    color: '#fff',
  },
  newReward: {
    fontSize: 14,
    color: 'yellow', // Change to yellow
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 60,
    borderRadius: 10,
    alignItems: 'center',
  },
  availableCostumesText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  costumeScroll: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  costumeItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  costumeImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  inUseStamp: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default Companions;
