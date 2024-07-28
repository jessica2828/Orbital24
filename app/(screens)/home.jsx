import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, TouchableOpacity, StyleSheet, Text, View, Modal, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import HomeButton from '@/components/HomeButton';
import Currency from '../../components/currency';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Tutorial from '../../components/Tutorial';


export default function Home({ navigation }) {

  const [pearlCurrency, setPearlCurrency] = useState(0);
  const [shellCurrency, setShellCurrency] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        fetchCurrency(user);
        const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists() && !userSnapshot.data().hasCompletedTutorial) {
          setShowTutorial(true);
        }
        fetchInvitations(user.uid);
      } else {
        setCurrentUserId(null);
        setPearlCurrency(0);
        setShellCurrency(0);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        fetchCurrency(user);
        fetchInvitations(user.uid);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        fetchCurrency(user);
        fetchInvitations(user.uid);
      }
    }, [])
  );

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const fetchCurrency = async (user) => {
    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      setPearlCurrency(userSnapshot.data().pearlCurrency || 0);
      setShellCurrency(userSnapshot.data().shellCurrency || 0);
    }
  };

  const fetchInvitations = async (userId) => {
    const userDoc = doc(FIRESTORE_DB, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const invitations = userSnapshot.data().invitations || [];
      if (invitations.length > 0) {
        // get the latest invitation
        const latestInvitation = invitations[invitations.length - 1]; 
        setInvitationDetails(latestInvitation);
        setIsModalVisible(true);
      }
    }
  };

  // const handleAcceptInvitation = async () => {
  //   if (!currentUserId || !invitationDetails) {
  //     console.error('HERE');
  //     return;
  //   }
  //   try {
  //   const senderRef = doc(FIRESTORE_DB, 'users', invitationDetails.fromId);
  //   const receiverRef = doc(FIRESTORE_DB, 'users', currentUserId);

  //   await updateDoc(senderRef, {
  //     waitingRoomParticipants: arrayUnion(currentUserId)
  //   });

  //   router.push('/waitingroom');
  //   setIsModalVisible(false);
  // } catch (error) {
  //   console.error('Error accepting invitation:', error);
  //   Alert.alert('Error accepting invitation.');
  // }
  // };


  // WITH REMOVING INVITATION

//   const handleAcceptInvitation = async () => {
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   if (!currentUser || !invitationDetails) {
//     console.error('No current user or invitation details found.');
//     return;
//   }

//   const currentUserId = currentUser.uid;
//   try {
//     const senderRef = doc(FIRESTORE_DB, 'users', invitationDetails.fromId);
//     const receiverRef = doc(FIRESTORE_DB, 'users', currentUserId);

//     const receiverDoc = await getDoc(receiverRef);
//     if (receiverDoc.exists()) {
//       const receiverData = receiverDoc.data();
//       const invitations = receiverData.invitations || [];

//       const updatedInvitations = invitations
//         .map((inv, index) => {
//           if (index === invitations.length - 1) return null; // Remove the latest invitation
//           if (inv.fromId === invitationDetails.fromId && inv.roomCode === invitationDetails.roomCode) {
//             return { ...inv, declined: true };
//           }
//           return inv;
//         })
//         .filter(inv => inv !== null); // Remove null entries

//       await updateDoc(receiverRef, {
//         invitations: updatedInvitations
//       });
//     }

//     router.push('/waitingroom');
//     setIsModalVisible(false);
//   } catch (error) {
//     console.error('Error accepting invitation:', error);
//     Alert.alert('Error accepting invitation.');
//   }
// };


  const handleAcceptInvitation = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser || !invitationDetails) {
      console.error('No current user or invitation details found.');
      return;
    }
  
    const currentUserId = currentUser.uid;
    try {
      const senderRef = doc(FIRESTORE_DB, 'users', invitationDetails.fromId);
      const receiverRef = doc(FIRESTORE_DB, 'users', currentUserId);
  
      const receiverDoc = await getDoc(receiverRef);
      if (receiverDoc.exists()) {
        const receiverData = receiverDoc.data();
        const invitations = receiverData.invitations || [];
  
        const updatedInvitations = invitations
          .map((inv, index) => {
            if (index === invitations.length - 1) return null; 
            if (inv.fromId === invitationDetails.fromId && inv.roomCode === invitationDetails.roomCode) {
              return { ...inv, accepted: true };
            }
            return inv;
          })
          .filter(inv => inv !== null); 
  
        await updateDoc(receiverRef, {
          invitations: updatedInvitations
        });
      }
  
      const senderDoc = await getDoc(senderRef);
      if (senderDoc.exists()) {
        const senderData = senderDoc.data();
        const sentInvitations = senderData.sentInvitations || [];
  
        const updatedSentInvitations = sentInvitations.map(inv => {
          if (inv.to === currentUserId && inv.roomCode === invitationDetails.roomCode) {
            return { ...inv, accepted: true };
          }
          return inv;
        });
  
        await updateDoc(senderRef, {
          sentInvitations: updatedSentInvitations
        });
      }
  
      router.push('/waitingroom', { roomCode: invitationDetails.roomCode, friendId: currentUserId });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      Alert.alert('Error accepting invitation.');
    }
  };

  // const handleAcceptInvitation = async () => {
  //   const auth = getAuth();
  //   const currentUser = auth.currentUser;
  
  //   if (!currentUser || !invitationDetails) {
  //     console.error('No current user or invitation details found.');
  //     return;
  //   }
  
  //   const currentUserId = currentUser.uid;
  //   try {
  //     const senderRef = doc(FIRESTORE_DB, 'users', invitationDetails.fromId);
  //     const receiverRef = doc(FIRESTORE_DB, 'users', currentUserId);
  
  //     const receiverDoc = await getDoc(receiverRef);
  //     if (receiverDoc.exists()) {
  //       const receiverData = receiverDoc.data();
  //       const invitations = receiverData.invitations || [];
  
  //       const updatedInvitations = invitations
  //         .map((inv, index) => {
  //           if (index === invitations.length - 1) return null; // Remove the latest invitation
  //           if (inv.fromId === invitationDetails.fromId && inv.roomCode === invitationDetails.roomCode) {
  //             return { ...inv, accepted: true };
  //           }
  //           return inv;
  //         })
  //         .filter(inv => inv !== null); // Remove null entries
  
  //       await updateDoc(receiverRef, {
  //         invitations: updatedInvitations
  //       });
  //     }
  
  //     router.push('/waitingroom');
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     console.error('Error accepting invitation:', error);
  //     Alert.alert('Error accepting invitation.');
  //   }
  // };
  
  const handleDeclineInvitation = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      console.error('No current user found.');
      return;
    }
  
    const currentUserId = currentUser.uid;
    const userDocRef = doc(FIRESTORE_DB, 'users', currentUserId);
    const userSnapshot = await getDoc(userDocRef);
  
    if (userSnapshot.exists()) {
      const invitations = userSnapshot.data().invitations || [];
      if (invitations.length > 0) {
        const latestInvitation = invitations[invitations.length - 1];
  
        const updatedInvitations = invitations.filter(inv => 
          !(inv.fromId === latestInvitation.fromId && inv.roomCode === latestInvitation.roomCode)
        );
  
        await updateDoc(userDocRef, {
          invitations: updatedInvitations
        });
  
        Alert.alert('Invitation declined successfully.');
      }
    }
  
    setIsModalVisible(false);
  };
  



  return (
    <ImageBackground source={ require('../../assets/images/outdoor.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
      <Currency pearl={pearlCurrency} shell={shellCurrency} />
        <View style={styles.containerRoom}>
            <HomeButton 
              title="Room" 
              handlePress={() => router.push('/indoor')}
              textStyles="font-playfair2"
              containerStyles="w-2/5 mt-5"
            />
        </View>
        <View style={styles.containerFriends}>
          <HomeButton 
              title="Friends" 
              handlePress={() => router.push('/friends', { currentUserId })}
              textStyles="font-playfair2"
              containerStyles="w-1/3 mt-5"
          />
        </View>
        <View style={styles.containerPond}>
          <HomeButton 
            title="Pond" 
            handlePress={() => router.push('/pond')}
            textStyles="font-playfair2"
            containerStyles="w-1/3 mt-5"
          />
        </View>
        <View style={styles.containerShop}>
          <HomeButton 
            title="Shop" 
            handlePress={() => router.push('/shop')}
            textStyles="font-playfair2"
            containerStyles="w-2/5 mt-5"
          />
        </View>
        <StatusBar style="light" />
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Quest Invitation</Text>
              <Text style={styles.modalText}>
                {invitationDetails ? `${invitationDetails.from} has sent you a Quest Invitation! Focus duration: ${invitationDetails.focusDuration} mins` : ''}
              </Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleAcceptInvitation}
                >
                  <Text style={styles.modalButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleDeclineInvitation}
                >
                  <Text style={styles.modalButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    top: 10,
    justifyContent: 'center',
    alignItems: 'left',
  },
  containerRoom: {
    flex: 1 / 5,
    marginTop: 200,
    marginBottom: 0,
    marginLeft: 10,
    width: '30%',
  },
  containerShop: {
    flex: 1,
    top: 90,
    bottom: 0,
    left: 50,
    width: '30%',
  },
  containerPond: {
    flex: 1,
    top: 60,
    left: 150,
    width: '30%',
  },
  containerFriends: {
    flex: 2 / 5,
    top: 30,
    left: 230,
    width: '10%',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  link: {
    color: 'blue',
    marginTop: 6,
  },
  buttonText: {
    color: 'black',
  },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 15,
      fontFamily: 'PlayfairDisplay',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'PlayfairDisplay',
    },
    modalButton: {
      flex: 1,
      padding: 15,
      backgroundColor: '#0967a8',
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'PlayfairDisplay',
    },
    modalButtonsContainer: {
      flexDirection: 'row',
    },
});
