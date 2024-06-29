import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig'; 

const getUserData = async (userId) => {
  const userRef = doc(FIRESTORE_DB, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};

const UserList = ({ userIds, title }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userDataPromises = userIds.map(id => getUserData(id));
      const usersData = await Promise.all(userDataPromises);
      setUsers(usersData);
    };

    fetchUsers();
  }, [userIds]);

  return (
    <View>
      <Text>{title}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.username}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default UserList;
