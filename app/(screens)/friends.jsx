import React, { useState } from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import BackButton from '@/components/BackButton';
import { FIRESTORE_DB, FIREBASE_AUTH } from '@/src/FirebaseConfig';

const addFriend = async (currentUserId, friendEmail) => {
  try {
    const friendQuery = doc(FIRESTORE_DB, 'users', friendEmail);
    const friendSnapshot = await getDoc(friendQuery);

    if (friendSnapshot.exists()) {
      const friendId = friendSnapshot.id;

      const currentUserRef = doc(FIRESTORE_DB, 'users', currentUserId);
      await updateDoc(currentUserRef, {
        friends: arrayUnion(friendId),
      });

      const friendRef = doc(FIRESTORE_DB, 'users', friendId);
      await updateDoc(friendRef, {
        friends: arrayUnion(currentUserId),
      });

      Alert.alert('Friend added successfully');
    } else {
      Alert.alert('User not found');
    }
  } catch (error) {
    console.error('Error adding friend: ', error);
    Alert.alert('Error adding friend');
  }
};

const Friends = () => {
  const [friendEmail, setFriendEmail] = useState('');

  const handleAddFriend = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      await addFriend(currentUser.uid, friendEmail);
    } else {
      Alert.alert('No user is signed in');
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Friends</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter friend's email"
          value={friendEmail}
          onChangeText={setFriendEmail}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
          <Text style={styles.addButtonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
      <BackButton style={styles.backButton} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  addButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default Friends;
