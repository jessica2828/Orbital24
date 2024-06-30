import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH } from '@/src/FirebaseConfig';
import { ActivityIndicator } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';
import AlertPopup from '@/components/AlertPopup';
// import * as Google from 'expo-auth-session/providers/google';
// import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
// import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const auth = FIREBASE_AUTH;

  // //google sign-in feature

  // const [request, response, promptAsync] = useAuthRequest(
  //   {
  //     clientId: process.env.GOOGLE_CLIENT_ID || '210251895499-cbk4n7u5glc8hir1aoe07kc9l2lmhlqg.apps.googleusercontent.com',
  //     redirectUri: makeRedirectUri({
  //       // native: 'seas-the-day://redirect',
  //       useProxy: true,
  //     }),
  //     scopes: ['profile', 'email'],
  //   },
  //   Google.discovery
  // );

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential)
  //       .then((userCredential) => {
  //         console.log(userCredential);
  //         router.replace('/home');
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setErrorMessage(error.message);
  //         setIsPopupVisible(true);
  //       });
  //   }
  // }, [response]);

  const signIn = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      setIsPopupVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      const userId = response.user.uid;
      router.push('/home', { currentUserId: userId });
    } catch (error) {
      console.log(error);
      setErrorMessage('Please check your email or password.');
      setIsPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <ImageBackground source={require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
          <Text style={styles.label}>Password</Text>
          <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} />
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <CustomButton 
                title="Login" 
                handlePress={signIn}
                containerStyles={styles.buttonContainer} 
              />
              {/* <TouchableOpacity onPress={() => promptAsync()}>
                <Text style={styles.googleSignInText}>Sign in with Google</Text>
              </TouchableOpacity> */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href="/sign-up" style={styles.link}>Sign up</Link>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
      <BackButton />
      <AlertPopup
        visible={isPopupVisible}
        message={errorMessage}
        onClose={closePopup}
        closeText="OK"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    marginVertical: 4,
    marginHorizontal: 2,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 14,
    marginLeft: 15,
    marginTop: 10,
    color: '#D3D3D3', 
    fontFamily: 'PlayfairDisplay', 
  },
  buttonContainer: {
    width: '100%',
    marginTop: 56, 
  },
  footer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 12, 
    gap: 8, 
  },
  footerText: {
    fontSize: 14,
    color: '#D3D3D3', 
    fontFamily: 'PlayfairDisplay', 
  },
  link: {
    fontSize: 14,
    color: '#FFFFFF', 
    fontFamily: 'PlayfairDisplay', 
  },
  googleSignInText: {
    fontSize: 16,
    color: '#4285F4',
    textAlign: 'center',
    marginVertical: 10,
    top: 20,
    fontFamily: 'PlayfairDisplay',
  },
});

