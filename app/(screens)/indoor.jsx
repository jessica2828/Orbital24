import React, { useEffect, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeButton from '@/components/HomeButton';
import BackButton from '@/components/BackButton';
import Currency from './currency';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';

export default function App() {
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
        <ScrollView contentContainerStyle={{ height: '100%'}}>
            <ImageBackground source={ require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
            <Currency score={currency} style={styles.currency} />
                <View style={styles.containerGallery}>
                    <HomeButton 
                        title="Gallery" 
                        handlePress={() => router.push('/gallery')}
                        containerStyles="w-3/5 mt-14" 
                    /> 
                </View>
                <View style={styles.containerFocusSession}>
                    <HomeButton 
                        title="Start Focus Session" 
                        handlePress={() => router.push('/focus-session')}
                        containerStyles="w-3/5 mt-14" 
                    /> 
                    <StatusBar style="light" />
                    
                </View>
                <BackButton />
            </ImageBackground>
        </ScrollView>
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
        //alignContent: 'center',
        top: 0,
        left: 90,
        bottom: 100,
        width: '70%',
        //left: 100
        // alignItems: 'center',
        // justifyContent: 'center',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    containerGallery: {
        flex: 1,
        top: 220,
        //bottom: 10,
        width: '38%',
        left: 260,
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
});

