import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'

const HomeButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        containerStyles,
        isLoading && styles.loading
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Equivalent to 'bg-white bg-opacity-40'
    borderRadius: 12, // Equivalent to 'rounded-xl'
    minHeight: 40,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    opacity: 0.4, // Equivalent to 'opacity-40'
  },
  text: {
    color: 'black', // Use your desired primary color here
    fontFamily: 'PlayfairDisplay', // Ensure this font is linked properly in your project
    fontSize: 15, // Equivalent to 'text-base'
  },
});

export default HomeButton;

//with tailwind css

// import { TouchableOpacity, Text } from 'react-native'
// import React from 'react'

// const HomeButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
//   return (
//     <TouchableOpacity 
//       onPress={handlePress}
//       activeOpacity={0.7}
//       className={`bg-white bg-opacity-40 rounded-xl min-h-[40px] min-w-[120px] justify-center items-center 
//       ${containerStyles} ${isLoading ? 'opacity-40' : ''} `}
//       disabled={isLoading}
//     >
//       <Text className={`text-primary font-playfair2 text-base ${textStyles}`}>{title}</Text>
//     </TouchableOpacity>
//   )
// }

// export default HomeButton

