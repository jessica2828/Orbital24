import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

const LoadingScreenAfter = () => {
  return (
    <ImageBackground source={require('../assets/images/back.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <ActivityIndicator size="large" color="#0000ff" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
});

export default LoadingScreenAfter;

