import { View, Image, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { router, useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/src/FirebaseConfig';
import { ActivityIndicator } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
    });

      console.log(response);
      alert('Sign up successful!');
      router.replace('/sign-in');
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={ require('../../assets/images/indoor.png')} style={styles.backgroundImage}>  
      <View style={styles.overlay} />
      <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
          <Text className="text-lg text-gray-100 font-playfair2">  Name</Text>
          <TextInput 
            value={name} 
            style={styles.input}
            placeholder="Name"
            autoCapitalize="none"
            onChangeText={(text) => setName(text)} 
          />
          <Text className="text-lg text-gray-100 font-playfair2">  Email</Text>
          <TextInput 
            value={email} 
            style={styles.input} 
            placeholder="Email" 
            autoCapitalize="none" 
            onChangeText={(text) => setEmail(text)} 
          />
          <Text className="text-lg text-gray-100 font-playfair2">  Password</Text>
          <TextInput 
            secureTextEntry={true} 
            value={password} 
            style={styles.input} 
            placeholder="Password"
            autoCapitalize="none" 
            onChangeText={(text) => setPassword(text)} 
          />
          <Text className="text-lg text-gray-100 font-playfair2">  Confirm Password</Text>
          <TextInput
            secureTextEntry={true}
            value={confirmPassword}
            style={styles.input}
            placeholder="Confirm Password"
            autoCapitalize="none"
            onChangeText={(text) => setConfirmPassword(text)}
          />
          {loading ? ( 
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <CustomButton 
                title="Create an account" 
                handlePress={signUp}
                containerStyles="w-full mt-14" 
              />
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
    borderWidth: 0,
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
