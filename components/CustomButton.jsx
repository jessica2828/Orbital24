import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-white rounded-full min-h-[45px] justify-center items-center 
      ${containerStyles} ${isLoading ? 'opacity-40' : ''} `}
      disabled={isLoading}
    >
      <Text className={`text-primary font-playfair2 text-lg ${textStyles}`}>{title}</Text>
      </TouchableOpacity>
  )
}

export default CustomButton