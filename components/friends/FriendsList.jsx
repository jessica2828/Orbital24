import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebaseConfig';

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const friendsIds = userSnap.data().friends || [];
        const friendsPromises = friendsIds.map((id) => getDoc(doc(db, 'users', id)));
        const friendsDocs = await Promise.all(friendsPromises);
        const friendsData = friendsDocs.map((doc) => doc.data());
        setFriends(friendsData);
      }
    };

    fetchFriends();
  }, []);

  return (
    <View style={styles.container}>
      {friends.map((friend) => (
        <Text key={friend.email}>{friend.name}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
