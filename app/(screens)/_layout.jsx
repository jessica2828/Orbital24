// import { View, Text } from 'react-native'
// import React from 'react'

// const TabsLayout = () => {
//   return (
//     <View>
//       <Text>Tabs Layout</Text>
//     </View>
//   )
// }

// export default TabsLayout

import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router'; 
import { StatusBar } from 'expo-status-bar';

const ScreensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
        <Stack.Screen
          name="indoor"
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
        <Stack.Screen
          name="friends"
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
        <Stack.Screen
          name="pond"
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
        <Stack.Screen
          name="shop"
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
        <Stack.Screen
          name="focus-session"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="end-focus-session"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="overview"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="gallery"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
      </Stack>

      <StatusBar backgroundColor='black' style='light' />
    </>
  )
}

export default ScreensLayout