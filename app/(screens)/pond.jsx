import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import CustomButton from '@/components/CustomButton';

export default function App() {
    return (
        <ScrollView contentContainerStyle={{ height: '100%'}}>
            <ImageBackground source={ require('../../assets/images/companions.png')} style={styles.backgroundImage}>
                <View style={styles.container}>
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)', 
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



