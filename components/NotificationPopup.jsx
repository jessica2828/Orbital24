import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const {width, height } = Dimensions.get('window');
const { Value, timing } = Animated;

export default class NotificationPopup extends Component {
  render() {
    const { visible, message, onClose, closeText, onAction, actionText } = this.props;
    return (
      <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.popup}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.notifButton} onPress={onClose}>
                <Text style={styles.notifButtonText}>{closeText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notifButton} onPress={onAction}>
                <Text style={styles.notifButtonText}>{actionText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    flex: 1,
    //flexDirection: 'row',
    backgroundColor: 'rgba(144, 205, 248, 0.8)',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily:'PlayfairDisplay',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    width: '100%',
    marginTop: 10,
  },
  notifButton: {
    flex: 1,
    marginHorizontal: 10,
    //marginBottom: 10,
    //paddingVertical: 2,
    //paddingHorizontal: 5,
    padding: 8,
    backgroundColor: '#0967a8',
    borderRadius: 5,
    alignItems: 'center',
  },
  notifButtonText: {
    fontFamily:'PlayfairDisplay',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});

// import React, { Component } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
// //import tailwind from 'tailwind-rn';
// //import { useTailwind } from 'tailwind-rn';

// const { width, height } = Dimensions.get('window');

// export default class NotificationPopup extends Component {
//   render() {
//     const { visible, message, onClose, closeText, onAction, actionText } = this.props;
//     const tw = useTailwind();

//     return (
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}
//       >
//         <View style={tw('flex-1 items-center justify-center bg-black bg-opacity-50')}>
//           <View style={[tw('w-4/5 bg-secondary-100 p-5 rounded-lg'), styles.popup]}>
//             <Text style={tw('text-lg mb-2 text-center font-playfair2')}>{message}</Text>
//             <View style={tw('flex-row justify-between mt-2 w-full')}>
//               <TouchableOpacity style={tw('flex-1 mx-1 py-2 px-3 bg-primary rounded-md items-center')} onPress={onClose}>
//                 <Text style={tw('text-base text-white font-pmedium')}>{closeText}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={tw('flex-1 mx-1 py-2 px-3 bg-primary rounded-md items-center')} onPress={onAction}>
//                 <Text style={tw('text-base text-white font-pmedium')}>{actionText}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   popup: {
//     width: width * 0.8,
//   },
// });
