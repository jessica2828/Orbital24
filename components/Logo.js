import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo () {
  return (
    //<Image source={require('../assets/logo.png')} style={styles.image} />
        <Image 
            source={{ uri: "https://png.pngtree.com/png-clipart/20230512/original/pngtree-cat-on-white-background-png-image_9158406.png"}}
            style={{ width: 200, height: 200}}
        />
    )
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8
  }
})