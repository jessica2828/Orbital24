import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import SearchInput from '../../components/SearchInput'
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import BackButton from '@/components/BackButton';

const addFriend = async (currentUserId, friendEmail) => {
  const friendQuery = doc(db, 'users', friendEmail);
  const friendSnapshot = await getDoc(friendQuery);

  if (friendSnapshot.exists()) {
    const friendId = friendSnapshot.id;

    const currentUserRef = doc(db, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      friends: arrayUnion(friendId),
    });

    const friendRef = doc(db, 'users', friendId);
    await updateDoc(friendRef, {
      friends: arrayUnion(currentUserId),
    });
  } else {
    console.log('User not found');
  }
};

const friends = () => {
  return (
    <ImageBackground>
    <View>
      <Text>friends</Text>
      <SearchInput />
    </View>
    <BackButton />
    </ImageBackground>
  )
}

export default friends