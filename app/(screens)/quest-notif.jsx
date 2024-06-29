import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig'; 

const updateNotificationStatus = async (notificationId, status) => {
  const notificationRef = doc(FIRESTORE_DB, 'notifications', notificationId);
  await updateDoc(notificationRef, { status: status });
};

const NotificationsScreen = ({ currentUserId, navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(FIRESTORE_DB, 'notifications'), where('receiverId', '==', currentUserId), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let notificationsArray = [];
      querySnapshot.forEach((doc) => {
        notificationsArray.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notificationsArray);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const handleAccept = async (notificationId, senderId) => {
    await updateNotificationStatus(notificationId, 'accepted');
    navigation.navigate('FocusSession', { senderId });
  };

  const handleDecline = async (notificationId) => {
    await updateNotificationStatus(notificationId, 'declined');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text>{item.senderId} invited you to a focus session</Text>
            <View style={styles.buttonContainer}>
              <Button title="Accept" onPress={() => handleAccept(item.id, item.senderId)} />
              <Button title="Decline" onPress={() => handleDecline(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NotificationsScreen;
