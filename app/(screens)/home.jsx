import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import HomeButton from '@/components/HomeButton';
import { useSpring, animated } from '@react-spring/native';


export default function Home() {
    return (
      <ImageBackground source={ require('../../assets/images/outdoor.png')} style={styles.backgroundImage}>
          <View style={styles.container}>
          <View style={styles.containerCurrency}>
            <Image source={require('../../assets/images/pearl.png')} className="w-14 h-14">
            </Image>
            <Image source={require('../../assets/images/shell.png')} className="w-14 h-14">
            </Image>
          </View>
          <View style={styles.containerRoom}>
              <HomeButton 
                title="Go to Room" 
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
      top: 20,
      justifyContent: 'center',
      alignItems: 'left',
    },
    containerCurrency: {
        flex: 1/3,
        top: 25,
        flexDirection: 'row'
    },
    containerRoom: {
        flex: 1/5,
        marginTop: 80,
        marginBottom: 0,
        //marginRight: 120,
        marginLeft: 30
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
      top: 90,
      //bottom: 50,
      left: 170,
      //right: 100
    },
    containerFriends: {
      flex: 1/5,
      //top: 20,
      //bottom: 200,
      left: 280,
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