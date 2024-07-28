// import React, { useState, useEffect, useFocusEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, Alert } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
// import { FIRESTORE_DB } from '@/src/FirebaseConfig';
// import { useLocalSearchParams, router } from 'expo-router';
// import BackButton from '@/components/BackButton';

// const WaitingRoomScreen = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [receiverEmail, setReceiverEmail] = useState('');
//   const [focusDuration, setFocusDuration] = useState(25);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const auth = getAuth();
//   const currentUser = auth.currentUser;
//   const { roomCode, friendId } = useLocalSearchParams();

//   // useEffect(() => {
//   //   if (currentUser) {
//   //     setCurrentUserId(currentUser.uid);

//   //     const interval = setInterval(async () => {
//   //       const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
//   //       const userSnapshot = await getDoc(userRef);

//   //       if (userSnapshot.exists()) {
//   //         const data = userSnapshot.data();
//   //         if (data && data.sentInvitations) {
//   //           const sentInvitations = data.sentInvitations;
//   //           const acceptedInvitation = sentInvitations.find(inv => inv.accepted);

//   //           if (acceptedInvitation) {
//   //             setReceiverEmail(acceptedInvitation.to);
//   //             setFocusDuration(acceptedInvitation.focusDuration);
//   //             setIsModalVisible(true);
//   //             clearInterval(interval); 
//   //           }
//   //         }
//   //       }
//   //     }, 5000);

//   //     return () => clearInterval(interval);
//   //   }
//   // }, [currentUser, roomCode]);

//   useEffect(() => {
//     if (currentUser) {
//       setCurrentUserId(currentUser.uid);
  
//       const interval = setInterval(async () => {
//         const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
//         const userSnapshot = await getDoc(userRef);
  
//         if (userSnapshot.exists()) {
//           const data = userSnapshot.data();
//           if (data && data.sentInvitations) {
//             const sentInvitations = data.sentInvitations;
//             const acceptedInvitation = sentInvitations.find(inv => inv.accepted);
  
//             if (acceptedInvitation && acceptedInvitation.to !== currentUser.uid) { 
//               setReceiverEmail(acceptedInvitation.to);
//               setFocusDuration(acceptedInvitation.focusDuration);
//               setIsModalVisible(true);
//               clearInterval(interval); 
//             }
//           }
//         }
//       }, 5000);
  
//       return () => clearInterval(interval);
//     }
//   }, [currentUser, roomCode]);
  
//   // handle removing of sentInvitation here! (NOT DONE)
//   const handleStartQuest = () => {
//     router.push('/focus-session', { focusDuration });
//     setIsModalVisible(false);
//   };

//   const handleCancelQuest = async () => {
//     try {
//       if (!friendId || !roomCode || !focusDuration) {
//         Alert.alert('Error', 'Required parameters are missing.');
//         return;
//       }

//       const friendRef = doc(FIRESTORE_DB, 'users', friendId);
//       const friendDoc = await getDoc(friendRef);

//       if (!friendDoc.exists()) {
//         Alert.alert('Error', 'Friend document not found.');
//         return;
//       }

//       const friendData = friendDoc.data();
//       const { invitations } = friendData;

//       if (!Array.isArray(invitations)) {
//         Alert.alert('Error', 'No invitations found for this user.');
//         return;
//       }

//       const invitationToRemove = {
//         from: currentUser.uid,
//         roomCode,
//         focusDuration,
//       };

//       await updateDoc(friendRef, {
//         invitations: arrayRemove(invitationToRemove),
//       });

//       Alert.alert('Quest cancelled successfully');
//       setIsModalVisible(false);
//       router.push('/home');
//     } catch (error) {
//       Alert.alert('Error cancelling quest.');
//     }
//   };

//   return (
//     <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Waiting Room</Text>
//         <Text style={styles.email}>Quest is starting soon! Waiting for your friend...</Text>

//         <Modal
//           visible={isModalVisible}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setIsModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>
//                 Your friend has accepted your Quest Invitation! Start a Quest now?
//               </Text>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleStartQuest}
//               >
//                 <Text style={styles.modalButtonText}>Start</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleCancelQuest}
//               >
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </View>
//       <BackButton />
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 32,
//     color: '#fff',
//     marginBottom: 20,
//     fontFamily: 'PlayfairDisplay',
//   },
//   email: {
//     fontSize: 15,
//     color: '#fff',
//     marginBottom: 20,
//     fontFamily: 'PlayfairDisplay',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontFamily: 'PlayfairDisplay',
//   },
//   modalButton: {
//     padding: 15,
//     backgroundColor: '#0967a8',
//     borderRadius: 10,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'PlayfairDisplay',
//   },
// });

// export default WaitingRoomScreen;



/////

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import { useLocalSearchParams, router } from 'expo-router';
import BackButton from '@/components/BackButton';

const WaitingRoomScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [focusDuration, setFocusDuration] = useState(25);
  const [currentUserId, setCurrentUserId] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { roomCode, friendId } = useLocalSearchParams();

  useEffect(() => {
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
  
      const interval = setInterval(async () => {
        const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
  
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          if (data && data.sentInvitations) {
            const sentInvitations = data.sentInvitations;
            const acceptedInvitation = sentInvitations.find(inv => inv.accepted);
  
            if (acceptedInvitation && acceptedInvitation.to !== currentUser.uid) { 
              setReceiverEmail(acceptedInvitation.to);
              setFocusDuration(acceptedInvitation.focusDuration);
              setIsModalVisible(true);
              clearInterval(interval); 
            }
          }
        }
      }, 5000);
  
      return () => clearInterval(interval);
    }
  }, [currentUser, roomCode]);

  // const handleStartQuest = () => {
  //   router.push({ pathname: '/focus-session', params: { focusDuration } });
  //   setIsModalVisible(false);
  // };

  const handleStartQuest = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }
  
      const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        Alert.alert('Error', 'User document not found.');
        return;
      }
  
      const userData = userDoc.data();
      const sentInvitations = userData.sentInvitations;
  
      if (!sentInvitations || sentInvitations.length === 0) {
        Alert.alert('Error', 'No sent invitations to remove.');
        return;
      }
  
      const latestInvitation = sentInvitations[sentInvitations.length - 1];
      const updatedSentInvitations = sentInvitations.filter(inv => inv !== latestInvitation);
  
      await updateDoc(userRef, {
        sentInvitations: updatedSentInvitations,
      });
  
      router.push({ pathname: '/focus-session', params: { focusDuration } });
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to start quest.');
      console.error('Error in handleStartQuest:', error);
    }
  };
  

  const handleCancelQuest = async () => {
    try {
      if (!friendId || !roomCode || !focusDuration) {
        Alert.alert('Error', 'Required parameters are missing.');
        return;
      }

      const friendRef = doc(FIRESTORE_DB, 'users', friendId);
      const friendDoc = await getDoc(friendRef);

      if (!friendDoc.exists()) {
        Alert.alert('Error', 'Friend document not found.');
        return;
      }

      const friendData = friendDoc.data();
      const updatedInvitations = friendData.receivedInvitations.filter(inv => inv.roomCode !== roomCode);

      await updateDoc(friendRef, {
        receivedInvitations: updatedInvitations,
      });

      router.push('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel quest.');
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Waiting Room</Text>
        <Text style={styles.subtitle}>Waiting for your friend to join...</Text>
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Your friend has accepted your Quest Invitation! Start a Quest now?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.button} onPress={handleStartQuest}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancelQuest}>
                  <Text style={styles.buttonText}>Cancel Quest</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <BackButton />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: '#0967a8',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
  },
});

export default WaitingRoomScreen;
