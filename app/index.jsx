import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton';

export default function App() {
    return (
            <ScrollView contentContainerStyle={{ height: '100%'}}>
                <ImageBackground source={ require('../assets/images/indoor.png')} style={styles.backgroundImage}>
                    <View style={styles.overlay} />
                    <View style={styles.container}>
                        {/* <Image 
                            source={images.logo} 
                            className="w-[130px] h-[84px]"
                            resizeMode="contain"
                        /> */}
                        <StatusBar style="light" />
                        <CustomButton 
                            title="Login" 
                            handlePress={() => router.push('/sign-in')}
                            containerStyles="w-3/5 mt-7" />
                        <CustomButton 
                            title="Create an account" 
                            handlePress={() => router.push('/sign-up')}
                            containerStyles="w-3/5 mt-7" />
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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

