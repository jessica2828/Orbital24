import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image } from 'react-native';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIRESTORE_DB, FIREBASE_AUTH } from '@/src/FirebaseConfig';
import BackButton from '@/components/BackButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AlertPopup from '@/components/AlertPopup';

const searchUsersByEmail = async (email) => {
  const usersRef = collection(FIRESTORE_DB, 'users');
  const q = query(usersRef, where('email', '>=', email), where('email', '<=', email + '\uf8ff'));
  const querySnapshot = await getDocs(q);
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

const addFriend = async (currentUserId, friendId) => {
  try {
    const currentUserRef = doc(FIRESTORE_DB, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      friends: arrayUnion(friendId),
    });

    const friendRef = doc(FIRESTORE_DB, 'users', friendId);
    await updateDoc(friendRef, {
      friends: arrayUnion(currentUserId),
    });

    Alert.alert('Friend added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding friend: ', error);
    Alert.alert('Error adding friend');
    return false;
  }
};

const Friends = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedFriends, setAddedFriends] = useState(new Set());
  const [noUserFound, setNoUserFound] = useState(false);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        console.error("Error: User is not logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    if (!friendEmail.trim()) {
      Alert.alert('Missing Query', 'Please input an email to search');
      return;
    }
    setIsSearching(true);
    setNoUserFound(false);
    try {
      const users = await searchUsersByEmail(friendEmail);
      setFoundUsers(users);
      if (users.length === 0) {
        setNoUserFound(true);
      }
    } catch (error) {
      console.error("Error searching users: ", error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    if (!currentUserId) {
      Alert.alert('No user is signed in');
      return;
    }
    const success = await addFriend(currentUserId, friendId);
    if (success) {
      setAddedFriends((prev) => new Set(prev).add(friendId));
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
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleSearch}>
          <Text style={styles.addButtonText}>Search</Text>
        </TouchableOpacity>
        {isSearching && <Text>Searching...</Text>}
        {!isSearching && noUserFound && <Text style={styles.username}>No user found</Text>}
        <FlatList
          data={foundUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.username}>{item.email}</Text>
              {addedFriends.has(item.id) ? (
                <Image source={require('@/assets/icons/check-symbol.png')} style={styles.checkSymbol} />
              ) : (
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.id)}>
                  <Text style={styles.addButtonText}>Add Friend</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
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
    marginTop: getStatusBarHeight() + 150,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
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
    width: '50%',
    padding: 15,
    backgroundColor: '#0967a8',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 0,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'PlayfairDisplay',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '80%',
  },
  username: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
    right: 10,
    left: 2,
  },
  checkSymbol: {
    width: 30,
    height: 30,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default Friends;