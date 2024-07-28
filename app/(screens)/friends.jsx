import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image, ScrollView, Modal } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import BackButton from '@/components/BackButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Collapsible from 'react-native-collapsible';  
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

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

const fetchFriendsList = async (userId) => {
  const userRef = doc(FIRESTORE_DB, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const friendsIds = userData.friends || [];
    const friendsRefs = friendsIds.map(id => doc(FIRESTORE_DB, 'users', id));
    const friendsSnapshots = await Promise.all(friendsRefs.map(ref => getDoc(ref)));
    return friendsSnapshots.map(snapshot => ({ id: snapshot.id, ...snapshot.data() }));
  }
  return [];
};

const Friends = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedFriends, setAddedFriends] = useState(new Set());
  const [noUserFound, setNoUserFound] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true); 
  const [selectedFriend, setSelectedFriend] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [focusDuration, setFocusDuration] = useState(25);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        fetchFriendsList(user.uid).then(setFriendsList).catch(error => {
          console.error(' ', error);
          Alert.alert('Error fetching friends list.')
        });
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
      const updatedUsers = users.map(user => ({
        ...user,
        isFriend: friendsList.some(friend => friend.id === user.id)
      }));
      setFoundUsers(updatedUsers);
      if (updatedUsers.length === 0) {
        setNoUserFound(true);
      }
    } catch (error) {
      console.error("Error searching users: ", error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const truncateEmail = (email) => {
    if (!email) return ''; 
    if (email.length > 17) {
      return email.substring(0, 17) + '...';
    }
    return email;
  };  

  const handleAddFriend = async (friendId) => {
    if (!currentUserId) {
      Alert.alert('No user is signed in');
      return;
    }
    const success = await addFriend(currentUserId, friendId);
    if (success) {
      setFoundUsers(prevUsers =>
        prevUsers.map(user => 
          user.id === friendId 
          ? { ...user, isFriend: true } 
          : user
        )
      );
      setAddedFriends((prev) => new Set(prev).add(friendId));
    }
  };

  const handleSendInvitation = async (friendId, focusDuration) => {
    try {
      const roomCode = generateRoomCode();
      const currentUser = getAuth().currentUser;
      const currentUserEmail = currentUser.email;
      const currentUserId = currentUser.uid;

      const friendRef = doc(FIRESTORE_DB, 'users', friendId);
      const senderRef = doc(FIRESTORE_DB, 'users', currentUserId);
  
      await updateDoc(friendRef, {
        invitations: arrayUnion({
          from: currentUserEmail,
          fromId: currentUserId,
          roomCode,
          focusDuration,
          timestamp: new Date(),
          declined: false,
        }),
      });

      await updateDoc(senderRef, {
        sentInvitations: arrayUnion({
          to: friendId,
          roomCode,
          focusDuration,
          timestamp: new Date(),
          accepted: false,
        }),
      });

      Alert.alert('Invitation sent successfully!');
      console.log('Navigating to waiting-room with:', { roomCode, focusDuration, friendId });
      router.push('/waitingroom', { 
        roomCode,
        focusDuration,
        friendId
      })
    } catch (error) {
      console.error('Error sending invitation: ', error);
      Alert.alert('Error sending invitation.');
    } finally {
      setIsModalVisible(false);
    }
  };
  
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const openInvitationModal = (friend) => {
    setSelectedFriend(friend);
    setFocusDuration(25);
    setIsModalVisible(true);
  }


  const durations = [];
  for (let i = 10; i <= 120; i++) {
    durations.push(i);
  }

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
              <Text style={styles.username}>{truncateEmail(item.email)}</Text>
              {item.isFriend ? (
                <Image source={require('@/assets/icons/check-symbol.png')} style={styles.checkSymbol} />
              ) : (
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.id)}>
                  <Text style={styles.addButtonText}>Add Friend</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        <TouchableOpacity style={styles.collapseButton} onPress={() => setIsCollapsed(!isCollapsed)}>
          <Text style={styles.collapseButtonText}>{isCollapsed ? 'My Friend List' : 'Hide Friend List'}</Text>
        </TouchableOpacity>
        <Collapsible collapsed={isCollapsed}>
          <ScrollView style={styles.friendsListContainer}>
            {friendsList.map((item) => (
              <View style={styles.userItem} key={item.id}>
                <Text style={styles.username}>{truncateEmail(item.email)}</Text>
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => openInvitationModal(item)}
                >
                  <Text style={styles.inviteButtonText}>Quest Invite</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </Collapsible>
      </View>
      <BackButton style={styles.backButton} />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Quest Invitation</Text>
            <Text style={styles.modalText}>Invite {selectedFriend?.email} to join your focus session?</Text>
            <Text style={styles.modalText}>Set focus duration (minutes):</Text>
            <Picker
              selectedValue={focusDuration}
              style={styles.picker}
              onValueChange={(itemValue) => setFocusDuration(itemValue)}
            >
              {durations.map((duration) => (
                <Picker.Item key={duration} label={`${duration} mins`} value={duration} />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSendInvitation(selectedFriend.id, focusDuration)}
            >
              <Text style={styles.modalButtonText}>Send Invitation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton1}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: '100%',
  },
  username: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
  },
  checkSymbol: {
    width: 30,
    height: 30,
  },
  collapseButton: {
    width: '80%',
    padding: 10,
    backgroundColor: '#0967a8',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 65,
  },
  collapseButtonText: {
    color: '#fff',
    fontFamily: 'PlayfairDisplay',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendsListContainer: {
    width: '90%',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  inviteButton: {
    width: '50%',
    padding: 15,
    backgroundColor: '#0967a8',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
 },
 inviteButtonText: {
   color: '#fff',
   fontFamily: 'PlayfairDisplay',
   fontSize: 13,
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
  fontFamily: 'PlayfairDisplay',
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
  width: '80%',
  padding: 15,
  backgroundColor: '#0967a8',
  borderRadius: 10,
  alignItems: 'center',
  marginVertical: 10,
  marginTop: 150,
},
modalButton1: {
  width: '80%',
  padding: 15,
  backgroundColor: '#0967a8',
  borderRadius: 10,
  alignItems: 'center',
  marginVertical: 0,
},
modalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'PlayfairDisplay',
},
picker: {
  width: '100%',
  height: 50,
  marginBottom: 20,
  color: '#808080',
},

});

export default Friends;
