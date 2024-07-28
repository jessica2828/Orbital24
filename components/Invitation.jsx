import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import { getAuth } from 'firebase/auth';

const Invitation = () => {
    const [invitations, setInvitations] = useState([]);
    const auth = getAuth();
    const currentUserId = auth.currentUser.uid;
  
    useEffect(() => {
      const fetchInvitations = async () => {
        const userRef = doc(FIRESTORE_DB, 'users', currentUserId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setInvitations(userDoc.data().invitations || []);
        }
      };
      fetchInvitations();
    }, [currentUserId]);
  
    const handleAcceptInvitation = async (invitation) => {
      try {
        const roomRef = doc(FIRESTORE_DB, 'rooms', invitation.roomCode);
        await updateDoc(roomRef, {
          participants: arrayUnion(currentUserId),
        });
  
        Alert.alert('Joined the room successfully!');
      } catch (error) {
        console.error('Error joining room: ', error);
        Alert.alert('Error joining room');
      }
    };
  
    return (
    <View>
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.roomCode}
        renderItem={({ item }) => (
          <View style={styles.invitationItem}>
            <Text style={styles.invitationText}>Invitation from {item.from}</Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptInvitation(item)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
    );
  };
  
  export default Invitation
  
  const styles = StyleSheet.create({
    inviteButton: {
      backgroundColor: '#1abc9c',
      padding: 10,
      borderRadius: 8,
    },
    inviteButtonText: {
      color: '#fff',
      fontFamily: 'PlayfairDisplay',
    },
    invitationItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    invitationText: {
      fontSize: 16,
      fontFamily: 'PlayfairDisplay',
    },
    acceptButton: {
      backgroundColor: '#27ae60',
      padding: 10,
      borderRadius: 8,
      marginTop: 10,
      fontFamily: 'PlayfairDisplay',
    },
    acceptButtonText: {
      color: '#fff',
      fontFamily: 'PlayfairDisplay',
    },
  });