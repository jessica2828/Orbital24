import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';

export default function Home() {
    return (
            <ScrollView contentContainerStyle={{ height: '100%'}}>
                <ImageBackground source={ require('../../assets/images/outdoor.png')} style={styles.backgroundImage}>
                    <View style={styles.containerRoom}>
                        <CustomButton 
                          title="Go to Room" 
                          handlePress={() => router.push('/indoor')}
                          textStyles="font-playfair2"
                          containerStyles="w-2/5 mt-5"
                        />
                        <StatusBar style="light" />
                    </View>
                    <View style={styles.containerFriends}>
                        <CustomButton 
                          title="View Pond" 
                          handlePress={() => router.push('/indoor')}
                          textStyles="font-playfair2"
                          containerStyles="w-2/5 mt-5"
                        />
                    </View>
                    <View style={styles.containerShop}>
                        <CustomButton 
                          title="Go to Shop" 
                          handlePress={() => router.push('/indoor')}
                          textStyles="font-playfair2"
                          containerStyles="w-2/5 mt-5"
                        />
                    </View>
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
    containerRoom: {
        flex: 1,
        top: 180,
        bottom: 30,
        left: 20,
        //backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    containerShop: {
      flex: 1,
      top: 70,
      bottom: 40,
      left: 40
    },
    containerFriends: {
      flex: 1,
      top: 5,
      bottom: 90,
      left: 150
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