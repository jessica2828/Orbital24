// import { View, Image, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, ImageBackground } from 'react-native';
// import React, { useState } from 'react';
// import { Link, Redirect, router } from 'expo-router';
// import { FIREBASE_AUTH } from '@/src/FirebaseConfig';
// import { ActivityIndicator } from 'react-native-paper';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import CustomButton from '@/components/CustomButton';
// import BackButton from '@/components/BackButton';
// import NotificationPopup from '@/components/NotificationPopup';

// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const auth = FIREBASE_AUTH;

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       const response = await signInWithEmailAndPassword(auth, email, password);
//       console.log(response);
//       router.replace('/home');
//     } catch (error) {
//       console.log(error);
//       //alert('Sign in failed: ' + error.message)
//       setErrorMessage(error.message);
//       setIsPopupVisible(true);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <ImageBackground source={ require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <KeyboardAvoidingView behavior='padding'>
//           <Text className="text-base text-gray-100 font-playfair2">  Email</Text>
//           <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
//           <Text className="text-base text-gray-100 font-playfair2">  Password</Text>
//           <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
//           {loading ? ( 
//             <ActivityIndicator size="large" color="#fff" />
//           ) : (
//             <>
//               <CustomButton 
//                 title="Login" 
//                 handlePress={signIn}
//                 containerStyles="w-full mt-14" 
//               />
              
//               <View className="justify-center pt-3 flex-row gap-2">
//                 <Text className="flex-row text-sm text-gray-100 font-playfair2 justify-right">Don't have an account?</Text>
//                 <Link href="/sign-up" className="text-sm font-playfair2 text-white justify-right">Sign up</Link>
//               </View>

//               <BackButton />
//             </>
//           )}
//         </KeyboardAvoidingView>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 20,
//     flex: 1,
//     justifyContent: 'center'
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
//   },
//   input: {
//     marginVertical: 4,
//     marginHorizontal: 2,
//     height: 40,
//     borderWidth: 1,
//     borderRadius: 25,
//     padding: 10,
//     backgroundColor: '#fff'
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   }
// });


import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH } from '@/src/FirebaseConfig';
import { ActivityIndicator } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';
import NotificationPopup from '@/components/NotificationPopup';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      router.replace('/home');
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setIsPopupVisible(true);
    } finally {
      setLoading(false);
    }
  }

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
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href="/sign-up" style={styles.link}>Sign up</Link>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
      <BackButton />
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
    color: '#FFFFFF', // Adjust the color to match 'text-white'
    fontFamily: 'PlayfairDisplay', 
  },
});

//export default SignIn;
