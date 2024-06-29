// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ImageBackground } from 'react-native';
// import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { FIRESTORE_DB } from '@/src/FirebaseConfig';
// import SearchInput from '@/components/SearchInput';
// import { getStatusBarHeight } from 'react-native-status-bar-height';

// const sendFocusSessionInvitation = async (senderId, receiverId) => {
//   if (!senderId || !receiverId) {
//     console.error("Error: senderId or receiverId is missing.");
//     return;
//   }
//   try {
//     await addDoc(collection(FIRESTORE_DB, 'notifications'), {
//       receiverId: receiverId,
//       senderId: senderId,
//       type: 'focus_session_invitation',
//       status: 'pending',
//       timestamp: new Date()
//     });
//     Alert.alert('Success!', 'Focus session invitation sent.');
//   } catch (error) {
//     console.error("Error sending invitation: ", error);
//     Alert.alert('Error', 'Failed to send invitation');
//   }
// };

// const searchUsers = async (searchTerm) => {
//   const usersRef = collection(FIRESTORE_DB, 'users');
//   const q = query(usersRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
//   const querySnapshot = await getDocs(q);
//   let users = [];
//   querySnapshot.forEach((doc) => {
//     users.push({ id: doc.id, ...doc.data() });
//   });
//   return users;
// };

// const FriendsScreen = () => {
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [foundUsers, setFoundUsers] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setCurrentUserId(user.uid);
//       } else {
//         console.error("Error: User is not logged in.");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSearch = async (query) => {
//     if (!query.trim()) {
//       Alert.alert('Missing Query', 'Please input something to search');
//       return;
//     }
//     setIsSearching(true);
//     try {
//       const users = await searchUsers(query);
//       setFoundUsers(users);
//     } catch (error) {
//       console.error("Error searching users: ", error);
//       Alert.alert('Error', 'Failed to search users');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleFocusSession = async (receiverId) => {
//     if (!currentUserId) {
//       console.error("Error: currentUserId is not defined.");
//       Alert.alert('Error', 'You must be logged in to send an invitation');
//       return;
//     }
//     try {
//       await sendFocusSessionInvitation(currentUserId, receiverId);
//     } catch (error) {
//       console.error("Error sending focus session invitation: ", error);
//     }
//   };

//   return (
//     <ImageBackground source={require('../../assets/images/indoor.png')} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <SearchInput onSearch={handleSearch} />
//         {isSearching && <Text>Searching...</Text>}
//         <FlatList
//           data={foundUsers}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.userItem}>
//               <Text style={styles.username}>{item.name}</Text>
//               <TouchableOpacity style={styles.focusButton} onPress={() => handleFocusSession(item.id)}>
//                 <Text style={styles.buttonText}>Do Quest Together</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     top: 10 + getStatusBarHeight(),
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   userItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'gray',
//   },
//   username: {
//     fontSize: 18,
//   },
//   focusButton: {
//     backgroundColor: 'purple',
//     padding: 10,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: 'white',
//   },
// });

// export default FriendsScreen;


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
    width: '80%',
    padding: 15,
    backgroundColor: '#0967a8',
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'PlayfairDisplay',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default Friends;
