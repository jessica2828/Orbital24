import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import BackButton from '@/components/BackButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const FocusSessionOverview = () => {
  const [focusSessions, setFocusSessions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchFocusSessions();
    }
  }, [currentUserId, viewMode]);

  const fetchFocusSessions = async () => {
    const now = new Date();
    let startDate;

    if (viewMode === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (viewMode === 'week') {
      const startOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
    }

    const focusSessionsRef = collection(FIRESTORE_DB, 'focusSessions');
    const q = query(focusSessionsRef, where('userId', '==', currentUserId), where('timestamp', '>=', startDate));
    const querySnapshot = await getDocs(q);

    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push(doc.data());
    });

    setFocusSessions(sessions);
  };

  const calculateTotalDuration = () => {
    let totalDuration = 0;
    focusSessions.forEach((session) => {
      totalDuration += session.duration; 
    });

    return totalDuration;
  };

  const renderFocusSession = ({ item }) => (
    <View style={styles.sessionItem}>
      <Text>Session Date: {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</Text>
      <Text>Duration: {item.duration} minutes</Text>
    </View>
  );

  return (
    <ImageBackground source={require('@/assets/images/blank_sea.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.title}>Focus Session Overview</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setViewMode('day')}>
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setViewMode('week')}>
          <Text style={styles.buttonText}>Weekly</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.totalDuration}>Total Duration: {calculateTotalDuration()} minutes</Text>
      <FlatList
        data={focusSessions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFocusSession}
      />
    </View>
    <BackButton />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 100 + getStatusBarHeight(),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#0967a8',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
  },
  totalDuration: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  sessionItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
});

export default FocusSessionOverview;
