// import { Animated } from 'react-native';

// export const fadeTransition = () => ({
//   transitionSpec: {
//     duration: 500, // Adjust duration as needed
//     timing: Animated.timing,
//     easing: Easing.inOut(Easing.ease),
//   },
//   screenInterpolator: ({ position, scene }) => {
//     const { index } = scene;

//     const opacity = position.interpolate({
//       inputRange: [index - 1, index],
//       outputRange: [0, 1],
//     });

//     return { opacity };
//   },
// });
