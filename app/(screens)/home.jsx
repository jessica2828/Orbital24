import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Currency from '../../components/currency';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import HomeButton from '@/components/HomeButton';
import Tutorial from '@/components/Tutorial';

export default function Home({ navigation }) {
  const [pearlCurrency, setPearlCurrency] = useState(0);
  const [shellCurrency, setShellCurrency] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

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
        setCurrentUserId(user.uid);
        fetchCurrency(user);
        const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists() && !userSnapshot.data().hasCompletedTutorial) {
          setShowTutorial(true);
        }
      } else {
        setCurrentUserId(null);
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

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  return (
    <ImageBackground source={require('../../assets/images/outdoor.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Currency pearl={pearlCurrency} shell={shellCurrency} />
        <View style={styles.containerRoom}>
          <HomeButton
            title="Room"
            handlePress={() => router.push('/indoor')}
            textStyles="font-playfair2"
            containerStyles="w-2/5 mt-5"
          />
        </View>
        <View style={styles.containerFriends}>
          <HomeButton
            title="Friends"
            handlePress={() => router.push('/friends', { currentUserId })}
            textStyles="font-playfair2"
            containerStyles="w-1/3 mt-5"
          />
        </View>
        <View style={styles.containerPond}>
          <HomeButton
            title="Pond"
            handlePress={() => router.push('/pond')}
            textStyles="font-playfair2"
            containerStyles="w-1/3 mt-5"
          />
        </View>
        <View style={styles.containerShop}>
          <HomeButton
            title="Shop"
            handlePress={() => router.push('/shop')}
            textStyles="font-playfair2"
            containerStyles="w-2/5 mt-5"
          />
        </View>
        <StatusBar style="light" />
      </View>
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    top: 10,
    justifyContent: 'center',
    alignItems: 'left',
  },
  containerRoom: {
    flex: 1 / 5,
    marginTop: 200,
    marginBottom: 0,
    marginLeft: 10,
    width: '30%',
  },
  containerShop: {
    flex: 1,
    top: 90,
    bottom: 0,
    left: 50,
    width: '30%',
  },
  containerPond: {
    flex: 1,
    top: 60,
    left: 150,
    width: '30%',
  },
  containerFriends: {
    flex: 2 / 5,
    top: 30,
    left: 230,
    width: '10%',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  link: {
    color: 'blue',
    marginTop: 6,
  },
  buttonText: {
    color: 'black',
  },
});
