import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const EndFocusSession = () => {
    // const { params } = router.getCurrentRoute();
    // const { duration, earnedShells } = params;
    const { duration, earnedShells } = useLocalSearchParams();
  
    return (
      <ImageBackground source={require('@/assets/images/blank_sea.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>Focus Session Complete!</Text>
          <Text style={styles.text}>You focused for {Math.floor(duration)} minutes.</Text>
          <Text style={styles.text}>You earned {earnedShells} shells.</Text>
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
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
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

// const EndFocusSession = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { duration, earnedShells } = route.params;

//   return (
//     <ImageBackground source={require('@/assets/images/blank_sea.png')} style={styles.backgroundImage}>
//     <View style={styles.container}>
//       <Text style={styles.title}>Focus Session Complete!</Text>
//       <Text style={styles.text}>You focused for {Math.floor(duration)} minutes.</Text>
//       <Text style={styles.text}>You earned {earnedShells} shells.</Text>
//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('home')}>
//         <Text style={styles.buttonText}>Back to Home</Text>
//       </TouchableOpacity>
//     </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     width: '100%',
//     height: '100%',
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: 'PlayfairDisplay',
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: 'white'
//   },
//   text: {
//     fontSize: 14,
//     fontFamily: 'PlayfairDisplay',
//     color:'white',
//     marginBottom: 8,
//   },
//   button: {
//     marginTop: 24,
//     padding: 12,
//     backgroundColor: '#0967a8',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontFamily: 'PlayfairDisplay'
//   },
// });

// export default EndFocusSession;
