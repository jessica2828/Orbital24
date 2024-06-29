import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Currency = ({ pearl, shell }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icons/pearl.png')} style={styles.currencyImage} />
      <Text style={styles.currency}>{pearl}</Text>
      <Image source={require('../../assets/icons/shell.png')} style={styles.currencyImage} />
      <Text style={styles.currency}>{shell}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    backgroundColor: 'rgba(0, 211, 211, 0.5)',
    margin: 0,
    width: '98%',
    alignSelf: 'center',
  },
  currencyImage: {
    width: 40,
    height: 40,
    marginRight: 0,
  },
  currency: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
  },
});

export default Currency;
