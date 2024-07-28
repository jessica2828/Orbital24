import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, Button, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/BackButton'; 
import Currency from '../../components/currency'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';

const items = [
  { id: 'grass_skirt', name: 'Grass Skirt', description: 'A skirt made of grass, perfect for tropical adventures.', image: require('../../assets/images/grass_skirt.png'), price: 200 },
  { id: 'goggles', name: 'Goggles', description: 'Protective eyewear for swimming or working in dusty environments.', image: require('../../assets/images/goggles.png'), price: 50 },
];

const Shop = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [shells, setShells] = useState(0);
  const [pearls, setPearls] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState([]);

  const fetchCurrency = async (user) => {
    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      setPearls(userSnapshot.data().pearlCurrency || 0);
      setShells(userSnapshot.data().shellCurrency || 0);
      setPurchasedItems(userSnapshot.data().purchasedItems || []);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchCurrency(user);
      } else {
        setPearls(0);
        setShells(0);
        setPurchasedItems([]);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);


  const handleItemPress = (item) => {
    setSelectedItem(item);
  };

  const closeDescription = () => {
    setSelectedItem(null);
  };

  const handlePurchase = async (item) => {
    if (shells >= item.price) {
      const newShells = shells - item.price;
      setShells(newShells);
      const updatedPurchasedItems = [...purchasedItems, item.id];
      setPurchasedItems(updatedPurchasedItems);
      await AsyncStorage.setItem('purchasedItems', JSON.stringify(updatedPurchasedItems));

      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
        await updateDoc(userDoc, { shellCurrency: newShells, purchasedItems: updatedPurchasedItems });
      }

      Alert.alert('Purchase Successful', `You have purchased the ${item.name}`);
    } else {
      Alert.alert('Insufficient Shells', `You do not have enough shells to purchase the ${item.name}`);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <Currency pearl={pearls} shell={shells} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Shop</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            {purchasedItems.includes(item.id) ? (
              <Text style={styles.soldOutText}>Sold Out</Text>
            ) : (
              <TouchableOpacity style={styles.priceButton} onPress={() => handlePurchase(item)}>
                <Image source={require('../../assets/icons/shell.png')} style={styles.shellIcon} />
                <Text style={styles.priceText}>{item.price} shells</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <Modal visible={!!selectedItem} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && <Image source={selectedItem.image} style={styles.modalImage} />}
            {selectedItem && <Text style={styles.itemName}>{selectedItem.name}</Text>}
            {selectedItem && <Text style={styles.itemDescription}>{selectedItem.description}</Text>}
            <Button title="Close" onPress={closeDescription} />
          </View>
        </View>
      </Modal>
      <BackButton />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
  },
  headerText: {
    fontSize: 45,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
    color: 'white',
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
  },
  item: {
    width: '45%',
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
  },
  priceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  shellIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
  },
  soldOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
    color: 'red',
    marginTop: 10,
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Shop;
