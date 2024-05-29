import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { Link, Redirect, router } from 'expo-router';
import { FIREBASE_AUTH } from '@/src/FirebaseConfig';
import { ActivityIndicator } from 'react-native-paper';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert('Sign in failed: ' + error.message)
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your email!')
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={ require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
          <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
          <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
          {loading ? ( 
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <CustomButton 
                title="Login" 
                handlePress={signIn}
                containerStyles="w-full mt-7" />
              <BackButton />
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
  input: {
    marginVertical: 4,
    marginHorizontal: 2,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    backgroundColor: '#fff'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});



// import { View, Text } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const SignIn = () => {
//   return (
//     <SafeAreaView className="bg-black h-full">
//       <ScrollView>
//         <ImageBackground source={ require('../assets/images/indoor.png')} style={styles.backgroundImage}>
//           <View className="w-4/5 just">
//             <Image 
//               source={images.logo} 
//               className="w-[130px] h-[84px]"
//               resizeMode="contain"
//             />
//             <StatusBar style="light" />
//             <CustomButton 
//                   title="Login" 
//                   handlePress={() => router.push('/sign-in')}
//                   containerStyles="w-3/5 mt-7" />
//             <CustomButton 
//                   title="Create an account" 
//                   handlePress={() => router.push('/sign-up')}
//                   containerStyles="w-3/5 mt-7" />
//           </View>
//         </ImageBackground>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default SignIn
