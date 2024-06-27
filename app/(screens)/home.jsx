import React, { useEffect, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeButton from '@/components/HomeButton';
import { useSpring, animated } from '@react-spring/native';
//import { fadeTransition } from './CustomTransitionConfig'; // Import your custom transition config
import Currency from './currency';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';


export default function Home({ navigation }) {
  // const [sound, setSound] = useState();

  // const playSound = async () => {
  //   const { sound } = await Audio.Sound.createAsync(
  //      require('../../assets/music/home.mp3') 
  //   );
  //   setSound(sound);
  //   await sound.playAsync();
  // }

  // useEffect(() => {
  //   playSound();

  //   return () => {
  //     if (sound) {
  //       sound.stopAsync();
  //       sound.unloadAsync();
  //     }
  //   }
  // }, []);
  const [currency, setCurrency] = useState(0);

  const fetchCurrency = async (user) => {
    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      setCurrency(userSnapshot.data().currency || 0);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchCurrency(user);
      } else {
        setCurrency(0);
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

  return (
    <ImageBackground source={ require('../../assets/images/outdoor.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
      <Currency score={currency} style={styles.currency} />
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
              handlePress={() => router.push('/friends')}
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
    container: {
      flex: 1,
      top: 10,
      justifyContent: 'center',
      alignItems: 'left',
    },
    containerCurrency: {
        // flex: 1/5,
        // top: 25,
        flexDirection: 'row',
        flex: 1/5,
        marginTop: 80,
        marginBottom: 0,
        //marginRight: 120,
        marginLeft: 10
        //backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    currencyImage: {
      width: 40,
      height: 40,
      marginRight: 10,
    },
    containerRoom: {
        flex: 1/5,
        marginTop: 200,
        marginBottom: 0,
        //marginRight: 120,
        marginLeft: 10
        //backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    containerShop: {
      flex: 1,
      top: 90,
      bottom: 0,
      left: 50
    },
    containerPond: {
      flex: 1,
      top: 70,
      //bottom: 50,
      left: 150,
      //right: 100
    },
    containerFriends: {
      flex: 2/5,
      top: 30,
      //bottom: 200,
      left: 275,
      //right: 20
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
    }
});