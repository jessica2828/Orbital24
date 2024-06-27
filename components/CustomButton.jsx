// import { TouchableOpacity, Text } from 'react-native'
// import React from 'react'

// const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
//   return (
//     <TouchableOpacity 
//       onPress={handlePress}
//       activeOpacity={0.7}
//       className={`bg-white bg-opacity-50 rounded-full min-h-[45px] justify-center items-center 
//       ${containerStyles} ${isLoading ? 'opacity-40' : ''} `}
//       disabled={isLoading}
//     >
//       <Text className={`text-primary font-playfair2 text-lg ${textStyles}`}>{title}</Text>
//     </TouchableOpacity>
//   )
// }

// export default CustomButton

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, containerStyles, isLoading && styles.loading]}
      disabled={isLoading}
    >
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    minHeight: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', // Replace with your primary color
    fontFamily: 'PlayfairDisplay', // Ensure this font is correctly linked in your project
    fontSize: 18,
  },
  loading: {
    opacity: 0.4,
  },
});

export default CustomButton;
