import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Currency = ({ score }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/pearl.png')} style={styles.currencyImage} />
      <Text style={styles.currency}>{score}</Text>
      <Image source={require('../../assets/images/shell.png')} style={styles.currencyImage} />
      <Text style={styles.currency}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        position: 'absolute',
        top: 29,
        alignItems: 'center',
        borderRadius: 8,
        padding: 0,            
        backgroundColor: 'rgba(211, 211, 211, 0.5)',
        margin: 10,            
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
        fontWeight: 'bold'
    },
})

export default Currency;
