import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const EndFocusSession = () => {
    const { duration, earnedShells } = useLocalSearchParams();
    const url = 'exp://192.168.1.2:8081';
    const onShare = async () => {
      try {
        const result = await Share.share({
          message: ('I have just finished my focus session of ' + Math.floor(duration) + ' minutes on Seas The Day Productivity App! Try out the app now on Expo Go, and key in the following: ' + '\n' + url),
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log('shared with activity type of: ', result.activityType)
          } else {
            console.log('shared')
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('dismissed')
        }
      }
      catch (error) {
        console.log(error.message)
      }
    }
    
    return (
      <ImageBackground source={require('@/assets/images/blank_sea.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>Focus Session Complete!</Text>
          <Text style={styles.text}>You focused for {Math.floor(duration)} minutes.</Text>
          <Text style={styles.text}>You earned {earnedShells} shells.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/focus-session')}>
            <Text style={styles.buttonText}>Do another Focus Session</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container1}>
        
          <TouchableOpacity style={styles.button} onPress={onShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 5,
    },
    container1: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 0,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    title: {
      fontSize: 24,
      fontFamily: 'PlayfairDisplay',
      fontWeight: 'bold',
      marginBottom: 16,
      color: 'white'
    },
    text: {
      fontSize: 14,
      fontFamily: 'PlayfairDisplay',
      color:'white',
      marginBottom: 8,
    },
    button: {
      marginTop: 24,
      marginLeft: 10,
      marginRight: 10,
      padding: 12,
      backgroundColor: '#0967a8',
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: 'PlayfairDisplay'
    },
  });
  
  export default EndFocusSession;