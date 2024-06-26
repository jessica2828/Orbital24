import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeButton from '@/components/HomeButton';
import { useSpring, animated } from '@react-spring/native';
//import { fadeTransition } from './CustomTransitionConfig'; // Import your custom transition config


export default function Home() {
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

  return (
    <ImageBackground source={ require('../../assets/images/outdoor.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.containerCurrency}>
          <Image source={require('../../assets/images/pearl.png')} style={styles.currencyImage} />
          <Image source={require('../../assets/images/shell.png')} style={styles.currencyImage} />
        </View>
        <View style={styles.containerRoom}>
            <HomeButton 
              title="Go to Room" 
              handlePress={() => router.navigate('/indoor')}
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
            title="View Pond" 
            handlePress={() => router.push('/pond')}
            textStyles="font-playfair2"
            containerStyles="w-1/3 mt-5"
          />
        </View>
        <View style={styles.containerShop}>
          <HomeButton 
            title="Go to Shop" 
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
        marginTop: 80,
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
      flex: 1/5,
      //top: 20,
      //bottom: 200,
      left: 235,
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