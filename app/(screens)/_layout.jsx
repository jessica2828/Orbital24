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
            headerShown: false
          }}
        />
        <Stack.Screen
          name="indoor"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="friends"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="pond"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="shop"
          options={{
            headerShown: false
          }}
        />
      </Stack>

      <StatusBar backgroundColor='black' style='light' />
    </>
  )
}

export default ScreensLayout