import { Audio } from 'expo-av';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeButton from '@/components/HomeButton';
import BackButton from '@/components/BackButton';
import Currency from '@/components/currency';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';

export default function Indoor() {
  const [pearlCurrency, setPearlCurrency] = useState(0);
  const [shellCurrency, setShellCurrency] = useState(0);
  const [isInfoVisible, setIsInfoVisible] = useState(false); 

  const fetchCurrency = async (user) => {
    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      setPearlCurrency(userSnapshot.data().pearlCurrency || 0);
      setShellCurrency(userSnapshot.data().shellCurrency || 0);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchCurrency(user);
      } else {
        setPearlCurrency(0);
        setShellCurrency(0);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        fetchCurrency(user);
      }
    }, [])
  );

  const toggleInfoBox = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  return (
    <ImageBackground source={require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
      <Currency pearl={pearlCurrency} shell={shellCurrency} />
      <View style={styles.containerGallery}>
        <HomeButton 
          title="Gallery" 
          handlePress={() => router.push('/gallery')}
          containerStyles="w-3/5 mt-14" 
        /> 
      </View>
      <View style={styles.containerFocusSession}>
        <View style={styles.focusSessionRow}>
          <HomeButton 
            title="  Focus Session " 
            handlePress={() => router.push('/focus-session')}
            containerStyles="w-3/5 mt-14" 
          />
          <TouchableOpacity onPress={toggleInfoBox} style={styles.infoIcon}>
            <Image source={require('../../assets/icons/info.png')} style={styles.infoIconImage} />
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
      <View style={styles.containerOverview}>
        <HomeButton
          title="Overview"
          handlePress={() => router.push('/overview')}
          containerStyles="w-3/5 mt-14"
        />
      </View>
      <BackButton />

      <Modal
        visible={isInfoVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.infoText}>
                Welcome to the Focus Session feature! Here you can start a session to help you concentrate on your tasks. The longer you focus, the more rewards you can earn. Here are the details of the rewards based on the duration of your focus session:
                {'\n'}{'\n'}
                Less than 25 minutes:
                {'\n'}
                  - Earn currency only.
                {'\n'}
                  - No special rewards.
                {'\n'}{'\n'}
                25 to 49 minutes:
                {'\n'}
                  - 40% chance of receiving common rewards.
                {'\n'}
                  - 60% chance of no special rewards.
                {'\n'}{'\n'}
                50 to 89 minutes:
                {'\n'}
                  - 40% chance of receiving common rewards.
                {'\n'}
                  - 30% chance of receiving uncommon rewards.
                {'\n'}
                  - 30% chance of no special rewards.
                {'\n'}{'\n'}
                90 to 119 minutes:
                {'\n'}
                  - 40% chance of receiving common rewards.
                {'\n'}
                  - 30% chance of receiving uncommon rewards.
                {'\n'}
                  - 20% chance of receiving rare rewards.
                {'\n'}
                  - 10% chance of no special rewards.
                {'\n'}{'\n'}
                120 minutes or more:
                {'\n'}
                  - 20% chance of receiving common rewards.
                {'\n'}
                  - 30% chance of receiving uncommon rewards.
                {'\n'}
                  - 40% chance of receiving rare rewards.
                {'\n'}
                  - 10% chance of receiving legendary rewards!
                {'\n'}{'\n'}
                Make sure to set a clear goal, minimize distractions, and use any tools or techniques that help you stay focused. The longer you stay focused, the better the rewards you can earn. Happy focusing and good luck!
              </Text>
            </ScrollView>
            <TouchableOpacity onPress={toggleInfoBox} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent:  'center', 
    width: '100%',
    height: '100%',
  },
  containerFocusSession: {
    flex: 1,
    top: 110,
    left: 170,
    bottom: 100,
    width: '100%',
  },
  containerGallery: {
    flex: 1,
    top: 220,
    width: '20%',
    left: 220,
  },
  containerOverview: {
    flex: 1,
    top: 100,
    width: '40%',
    left: 200,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  focusSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: 10,
    marginTop: 20,
  },
  infoIconImage: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  infoText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'PlayfairDisplay'
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
