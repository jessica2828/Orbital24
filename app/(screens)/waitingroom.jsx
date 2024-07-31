import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayRemove, getDoc, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import { useLocalSearchParams, router } from 'expo-router';
import BackButton from '@/components/BackButton';
import Invitation from '../../components/Invitation';

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

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);

      const unsubscribe = onSnapshot(userRef, (doc) => {
        const data = doc.data();
        if (data && data.questStatus) {
          router.push({ pathname: '/focus-session', params: { focusDuration, autoStart: true } });
        } else if ( data && data.goHome) {
          router.push({ pathname: '/home'});
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

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

  
      const userData = userDoc.data();
      const sentInvitations = userData.sentInvitations;
  
      if (!sentInvitations || sentInvitations.length === 0) {
        Alert.alert('Error', 'No sent invitations!');
        return;
      }
  
      // Remove the latest invitation from the sentInvitations array
      const latestInvitation = sentInvitations[sentInvitations.length - 1];
      const updatedSentInvitations = sentInvitations.filter(inv => inv !== latestInvitation);
  
      // Update sender's document
      await updateDoc(userRef, {
        sentInvitations: updatedSentInvitations,
        questStatus: true, // add questStatus field
      });
  
      // Update receiver's document
      const receiverRef = doc(FIRESTORE_DB, 'users', latestInvitation.to);
      await updateDoc(receiverRef, {
        questStatus: true, // Add questStatus field
      });
  
      // router.push({ pathname: '/focus-session', params: { focusDuration, autoStart: true } });
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to start quest.');
      console.error('Error in handleStartQuest:', error);
    }
  };


  //WORKING 
  // const handleStartQuest = async () => {
  //   try {
  //     const auth = getAuth();
  //     const currentUser = auth.currentUser;
  
  //     if (!currentUser) {
  //       Alert.alert('Error', 'User not authenticated.');
  //       return;
  //     }
  
  //     const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
  //     const userDoc = await getDoc(userRef);
  
  //     if (!userDoc.exists()) {
  //       Alert.alert('Error', 'User document not found.');
  //       return;
  //     }
  
  //     const userData = userDoc.data();
  //     const sentInvitations = userData.sentInvitations;
  
  //     if (!sentInvitations || sentInvitations.length === 0) {
  //       Alert.alert('Error', 'No sent invitations to remove.');
  //       return;
  //     }
  
  //     const latestInvitation = sentInvitations[sentInvitations.length - 1];
  //     const updatedSentInvitations = sentInvitations.filter(inv => inv !== latestInvitation);
  
  //     await updateDoc(userRef, {
  //       sentInvitations: updatedSentInvitations,
  //     });
  
  //     router.push({ pathname: '/focus-session', params: { focusDuration } });
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to start quest.');
  //     console.error('Error in handleStartQuest:', error);
  //   }
  // };
  
  // const handleCancelQuest = async () => {
  //   try {
  //     const auth = getAuth();
  //     const currentUser = auth.currentUser;

  //     if (!currentUser) {
  //       Alert.alert('Error', 'User not authenticated.');
  //       return;
  //     }
  
  //     const userRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
  //     const userDoc = await getDoc(userRef);

  //     const userData = userDoc.data();
  //     const sentInvitations = userData.sentInvitations;
  
  //     if (!sentInvitations || sentInvitations.length === 0) {
  //       Alert.alert('Error', 'No sent invitations!');
  //       return;
  //     }
  //     // remove the latest invitation
  //     const latestInvitation = sentInvitations[sentInvitations.length - 1];
  //     const updatedSentInvitations = sentInvitations.filter(inv => inv !== latestInvitation);
  
  //     // update sender's document
  //     await updateDoc(userRef, {
  //       sentInvitations: updatedSentInvitations,
  //       goHome: true, // add goHome
  //     });
  
  //     // update receiver's document
  //     const receiverRef = doc(FIRESTORE_DB, 'users', latestInvitation.to);
  //     await updateDoc(receiverRef, {
  //       invitations: arrayRemove(latestInvitation),
  //       goHome: true, // add goHome
  //     });
  
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to cancelquest.');
  //     console.error('Error: ', error);
  //   }
  // }


  const handleCancelQuest = async () => {
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
        Alert.alert('Error', 'No sent invitations!');
        return;
      }
  
      // Remove the latest invitation
      const latestInvitation = sentInvitations[sentInvitations.length - 1];
      const updatedSentInvitations = sentInvitations.filter(inv => inv !== latestInvitation);
  
      // Update the sender's document
      await updateDoc(userRef, {
        sentInvitations: updatedSentInvitations,
        goHome: true,
      });
  
      // Update the receiver's document
      const receiverRef = doc(FIRESTORE_DB, 'users', latestInvitation.to);
      await updateDoc(receiverRef, {
        receivedInvitations: arrayRemove(latestInvitation),
        goHome: true,
      });
  
      setIsModalVisible(false);
      router.push('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel quest.');
      console.error('Error in handleCancelQuest:', error);
    }
  };
  


  // const handleCancelQuest = async () => {
  //   try {

  //     const friendRef = doc(FIRESTORE_DB, 'users', friendId);
  //     const friendDoc = await getDoc(friendRef);

  //     const friendData = friendDoc.data();
  //     const updatedInvitations = friendData.receivedInvitations.filter(inv => inv.focusDuration !== 0);

  //     await updateDoc(friendRef, {
  //       receivedInvitations: updatedInvitations,
  //     });

  //     router.push('/home');
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to cancel quest.');
  //   }
  // };

  return (
    <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Waiting Room</Text>
        <Text style={styles.subtitle}>Waiting for your friend...</Text>
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
