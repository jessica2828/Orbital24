import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const HomeButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-white bg-opacity-40 rounded-xl min-h-[40px] min-w-[120px] justify-center items-center 
      ${containerStyles} ${isLoading ? 'opacity-40' : ''} `}
      disabled={isLoading}
    >
      <Text className={`text-primary font-playfair2 text-base ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default HomeButton

// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import React from 'react';

// const HomeButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
//   return (
//     <TouchableOpacity 
//       onPress={handlePress}
//       activeOpacity={0.7}
//       style={[
//         styles.button,
//         containerStyles,
//         isLoading && styles.loadingButton,
//       ]}
//       disabled={isLoading}
//     >
//       <Text style={[styles.buttonText, textStyles]}>{title}</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: 'rgba(255, 255, 255, 0.6)', // Initial background opacity
//     borderRadius: 10, // Adjust as needed
//     minHeight: 40,
//     minWidth: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingButton: {
//     opacity: 0.6, 
//   },
//   buttonText: {
//     color: '#000', 
//     fontSize: 16,  
//     fontFamily: 'PlayFairDisplay',
//   },
// });

// export default HomeButton;
