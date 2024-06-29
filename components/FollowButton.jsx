import React from 'react';
import { Button } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig'; 

const followUser = async (currentUserId, targetUserId) => {
  const currentUserRef = doc(FIRESTORE_DB, 'users', currentUserId);
  const targetUserRef = doc(FIRESTORE_DB, 'users', targetUserId);

  await updateDoc(currentUserRef, {
    following: arrayUnion(targetUserId),
  });

  await updateDoc(targetUserRef, {
    followers: arrayUnion(currentUserId),
  });
};

const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUserRef = doc(FIRESTORE_DB, 'users', currentUserId);
  const targetUserRef = doc(FIRESTORE_DB, 'users', targetUserId);

  await updateDoc(currentUserRef, {
    following: arrayRemove(targetUserId),
  });

  await updateDoc(targetUserRef, {
    followers: arrayRemove(currentUserId),
  });
};


const FollowButton = ({ currentUserId, targetUserId, isFollowing, onFollowChange }) => {
  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(currentUserId, targetUserId);
    } else {
      await followUser(currentUserId, targetUserId);
    }
    onFollowChange();
  };

  return (
    <Button
      title={isFollowing ? 'Unfollow' : 'Follow'}
      onPress={handleFollow}
    />
  );
};

export default FollowButton;
