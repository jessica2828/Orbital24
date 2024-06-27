import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Link, useNavigation, useRouter } from "expo-router";

const BackButton = ({goBack}) => {
  const router = useRouter();
  return (
    <View style={styles.button}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.container} 
        testID='back'>
        <Image
          style={styles.image}
          source={require('../assets/icons/backbutton1.png')}
        />
      </TouchableOpacity>
    </View>
  )
}

export default BackButton

const styles = StyleSheet.create({
  container: {
    top: 5 + getStatusBarHeight(),
    left: 5
  },
  button: {
    flex: 1,
    position: 'absolute',
    bottom: 80,
    left: 30,
  },
  image: {
    width: 42,
    height: 41
  }
});