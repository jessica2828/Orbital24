import { View, Text } from 'react-native'
import React from 'react'

const shop = () => {
  return (
    <View>
      <Text>Shop</Text>
    </View>
  )
}

export default shop

// import React from 'react';
// import { View, Text } from 'react-native';
// import { useSpring, animated } from '@react-spring/native';

// const AnimatedText = animated(Text);

// const shop = () => {
//   const [props, api] = useSpring(
//     () => ({
//       from: { opacity: 0 },
//       to: { opacity: 1 },
//       loop: { reverse: true },
//     }),
//     []
//   );

//   return (
//     <View>
//       <AnimatedText
//         style={[
//           props,
//           {
//             fontSize: 24,
//             fontWeight: 'bold',
//             color: 'blue',
//             marginTop: 100,
//             textAlign: 'center',
//           },
//         ]}>
//         Hello Spring
//       </AnimatedText>
//     </View>
//   );
// };

// export default shop