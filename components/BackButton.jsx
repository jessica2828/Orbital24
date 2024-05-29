import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Link, useNavigation, useRouter } from "expo-router";

const BackButton = ({goBack}) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      onPress={() => router.back()} 
      style={styles.container} 
      testID='back'>
      <Image
        style={styles.image}
        source={require('../assets/icons/left-arrow.png')}
      />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  container: {
    top: 5 + getStatusBarHeight(),
    left: 5
  },
  image: {
    width: 32,
    height: 27
  }
});