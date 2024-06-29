import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const EndFocusSession = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { duration, earnedShells } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Session Complete!</Text>
      <Text style={styles.text}>You focused for {Math.floor(duration)} minutes.</Text>
      <Text style={styles.text}>You earned {earnedShells} shells.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
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
