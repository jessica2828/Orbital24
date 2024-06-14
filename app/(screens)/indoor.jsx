

import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeButton from '@/components/HomeButton';


export default function App() {
    return (
        <ScrollView contentContainerStyle={{ height: '100%'}}>
            <ImageBackground source={ require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
                <View style={styles.containerGallery}>
                    <HomeButton 
                        title="Gallery" 
                        handlePress={() => router.push('/gallery')}
                        containerStyles="w-2/5 mt-14" 
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
        top: 0,
        bottom: 100,
        left: 100
        // alignItems: 'center',
        // justifyContent: 'center',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    containerGallery: {
        flex: 1,
        top: 150,
        bottom: 10,
        left: 240
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

