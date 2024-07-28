import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Share, Alert, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';

const EndFocusSession = () => {
  const { duration, earnedShells } = useLocalSearchParams();
  const [earnedRewards, setEarnedRewards] = useState([]);
  const [specialReward, setSpecialReward] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const url = 'exp://192.168.1.2:8081';

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: ('I have just finished my focus session of ' + Math.floor(duration) + ' minutes on Seas The Day Productivity App! Try out the app now on Expo Go, and key in the following: ' + '\n' + url),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of: ', result.activityType);
        } else {
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    generateRewards();
  }, []);

  const generateRewards = async () => {
    let rewards = [];
    let special = null;

    const commonRewards = [
      { type: 'picture', name: 'Photo 1', image: require('@/assets/images/g1.png'), description: 'Graceful Drifter (common)' },
      { type: 'picture', name: 'Photo 2', image: require('@/assets/images/g2.png'), description: 'Daylight (common)' },
      { type: 'picture', name: 'Photo 3', image: require('@/assets/images/g3.png'), description: 'Underwater Skyscrapers (common)' },
      { type: 'picture', name: 'Photo 4', image: require('@/assets/images/g4.png'), description: 'Free as a Bird (common)' },
    ];

    const uncommonRewards = [
      { type: 'companion', id: 1, name: 'Companion 1', image: require('@/assets/images/c1.png'), description: 'Orange Loaf (uncommon)' },
      { type: 'companion', id: 2, name: 'Companion 2', image: require('@/assets/images/c2.png'), description: 'Gray Loaf (uncommon)' },
      { type: 'companion', id: 3, name: 'Companion 3', image: require('@/assets/images/c3.png'), description: 'Blue Loaf (uncommon)' },
      { type: 'picture', name: 'Photo 5', image: require('@/assets/images/g5.png'), description: 'A good ride home! (uncommon)' },
      { type: 'picture', name: 'Photo 6', image: require('@/assets/images/g6.png'), description: 'CLOSE ENCOUNTER (uncommon)' },
      { type: 'picture', name: 'Photo 7', image: require('@/assets/images/g7.png'), description: 'Lunch Break (uncommon)' },
    ];

    const rareRewards = [
      { type: 'companion', id: 4, name: 'Companion 4', image: require('@/assets/images/c4.png'), description: 'Lionfish Cat (Rare)' },
      { type: 'companion', id: 5, name: 'Companion 5', image: require('@/assets/images/c5.png'), description: 'Goldfish Cat (Rare)' },
      { type: 'companion', id: 6, name: 'Companion 6', image: require('@/assets/images/c6.png'), description: 'Shrimp Cat (Rare)' },
      { type: 'picture', name: 'Photo 8', image: require('@/assets/images/g8.png'), description: 'Playful Pod (Rare)' },
      { type: 'picture', name: 'Photo 9', image: require('@/assets/images/g9.png'), description: 'Majestic Glow (Rare)' },
    ];

    const legendaryRewards = [
      { type: 'picture', name: 'Photo 10', image: require('@/assets/images/g10.png'), description: 'Golden Paradise (Legendary)' },
      { type: 'companion', id: 7, name: 'Companion 7', image: require('@/assets/images/c7.png'), description: '"Normal" Cat (Legendary)' },
    ];

    if (duration >= 25 && duration < 50) {
      if (Math.random() < 0.4) special = commonRewards[Math.floor(Math.random() * commonRewards.length)];
    } else if (duration >= 50 && duration < 90) {
      const chance = Math.random();
      if (chance < 0.4) special = commonRewards[Math.floor(Math.random() * commonRewards.length)];
      else if (chance < 0.7) special = uncommonRewards[Math.floor(Math.random() * uncommonRewards.length)];
    } else if (duration >= 90 && duration < 120) {
      const chance = Math.random();
      if (chance < 0.4) special = commonRewards[Math.floor(Math.random() * commonRewards.length)];
      else if (chance < 0.7) special = uncommonRewards[Math.floor(Math.random() * uncommonRewards.length)];
      else if (chance < 0.9) special = rareRewards[Math.floor(Math.random() * rareRewards.length)];
    } else if (duration >= 120) {
      const chance = Math.random();
      if (chance < 0.2) special = commonRewards[Math.floor(Math.random() * commonRewards.length)];
      else if (chance < 0.5) special = uncommonRewards[Math.floor(Math.random() * uncommonRewards.length)];
      else if (chance < 0.9) special = rareRewards[Math.floor(Math.random() * rareRewards.length)];
      else special = legendaryRewards[Math.floor(Math.random() * legendaryRewards.length)];
    }

    if (special) {
      rewards.push(special);
      setSpecialReward(special);
    } else {
      setSpecialReward(null);
    }

    setEarnedRewards(rewards);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        const unlockedCompanions = data.unlockedCompanions || [];
        const unlockedPictures = data.unlockedPictures || [];
        const newlyUnlockedPictures = data.newlyUnlockedPictures || [];

        rewards.forEach(reward => {
          if (reward.type === 'companion' && !unlockedCompanions.includes(reward.id)) {
            unlockedCompanions.push(reward.id);
          }
          if (reward.type === 'picture' && !unlockedPictures.includes(reward.name)) {
            unlockedPictures.push(reward.name);
            newlyUnlockedPictures.push(reward.name); 
          }
        });

        await updateDoc(userDoc, { unlockedCompanions, unlockedPictures, newlyUnlockedPictures });
      }
    }
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedReward(null);
  };

  return (
    <ImageBackground source={require('@/assets/images/blank_sea.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Focus Session Complete!</Text>
        <Text style={styles.text}>You focused for {Math.floor(duration)} minutes.</Text>
        <Text style={styles.text}>You earned {earnedShells} shells.</Text>
        {specialReward ? (
          <TouchableOpacity style={styles.specialRewardContainer} onPress={() => handleRewardPress(specialReward)}>
            <Text style={styles.specialRewardTitle}>Special Reward:</Text>
            <Image source={specialReward.image} style={styles.specialRewardImage} />
            <Text style={styles.specialRewardText}>{specialReward.name}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.specialRewardContainer}>
            <Text style={styles.specialRewardTitle}>Special Reward:</Text>
            <Text style={styles.specialRewardText}>Better luck next time!</Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/focus-session')}>
          <Text style={styles.buttonText}>Do another Focus Session</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container1}>
        <TouchableOpacity style={styles.button} onPress={onShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalContainer} onPress={handleModalClose}>
          {selectedReward && (
            <View style={styles.modalContent}>
              <Image source={selectedReward.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedReward.name}</Text>
              <Text style={styles.modalDescription}>{selectedReward.description}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay',
    fontWeight: 'bold',
    marginTop: 13,
    color: 'white'
  },
  text: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginLeft: 10,
    marginRight: 10,
    padding: 12,
    backgroundColor: '#0967a8',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'PlayfairDisplay'
  },
  rewardsContainer: {
    marginTop: 20,
  },
  specialRewardContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  specialRewardTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
    marginBottom: 10,
  },
  specialRewardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  specialRewardText: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
  },
  rewardsTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
    marginBottom: 10,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardImage: {
    width: 200,
    height: 200,
    marginRight: 20,
  },
  rewardText: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
  },
  newReward: {
    fontSize: 14,
    color: 'yellow',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 275,
    height: 275,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay',
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay',
    color: 'black',
    textAlign: 'center',
  },
});

export default EndFocusSession;

