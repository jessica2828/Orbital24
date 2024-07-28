import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';

const tutorialSteps = [
  { text: "Oh Hi there! You're new here, aren't you? Let me show you around!   ⁄(⁄ ⁄ ⁄ω⁄ ⁄ ⁄)⁄", highlight: 'none' },
  { text: "There are four places you can go to. Room, Pond, Friends, and Shop.", highlight: 'buttons'},
  { text: "The room allows you to start focus sessions, get currency and special rewards such as cute companions like me >< and photos!", highlight: 'room' },
  { text: "You can also see the statistics of your daily, monthly or yearly focus time and view beautiful photos your companion has taken while you are hard at work!", highlight: 'room'},
  { text: "The Shop allows you to buy costumes for your animal companions!", highlight: 'shop' },
  { text: "The Pond allows you to view the companion you've unlocked and equip companions with costumes you bought from the shop.", highlight: 'pond' },
  { text: "The Friends button allows you to add search and friends.", highlight: 'friends' },
  { text: "Have fun while being productive! Start exploring now :>", highlight: 'none' },
];

const Tutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNextStep = async () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      await updateTutorialStatus();
      onComplete();
    }
  };

  const updateTutorialStatus = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
      try {
        await updateDoc(userDoc, {
          hasCompletedTutorial: true,
        });
        console.log('Tutorial status updated successfully.');
      } catch (error) {
        console.error('Error updating tutorial status: ', error);
      }
    }
  };

  const getHighlightStyle = (highlight) => {
    switch (highlight) {
      case 'none':
        return {};
      case 'buttons':
        return [
          { top: 205, left: 5, width: 130, height: 50 },
          { top: 692, left: 45, width: 130, height: 50 },
          { top: 414, left: 145, width: 130, height: 50 },
          { top: 285, left: 225, width: 130, height: 50 }
        ];
      case 'room':
        return { top: 205, left: 5, width: 130, height: 50 };
      case 'shop':
        return { top: 692, left: 45, width: 130, height: 50 };
      case 'pond':
        return { top: 414, left: 145, width: 130, height: 50 };
      case 'friends':
        return { top: 285, left: 225, width: 130, height: 50 };
      default:
        return {};
    }
  };

  const getSpeechBubblePosition = (highlight) => {
    switch (highlight) {
      case 'buttons':
        return {postition: 'absolute', top: 160, left: 6};
      case 'room':
        return { position: 'absolute', top: 260, left: 6 };
      case 'shop':
        return { position: 'absolute', top: 500, left: 6 };
      case 'pond':
        return { position: 'absolute', top: 190, left: 6 };
      case 'friends':
        return { position: 'absolute', top: 330, left: 6 };
      default:
        return {};
    }
  };

  const highlightStyle = getHighlightStyle(tutorialSteps[step].highlight);

  return (
    <View style={styles.overlay}>
      <View style={styles.illustrationBackground} />
      <View style={styles.darkOverlay} />
      {highlightStyle.width && (
        <View style={[styles.transparentOverlay, highlightStyle]} />
      )}
      <View style={[styles.container, getSpeechBubblePosition(tutorialSteps[step].highlight)]}>
        <Image source={require('../assets/images/c1.png')} style={styles.icon} />
        <View style={styles.speechBubble}>
          <Text style={styles.tutorialText}>{tutorialSteps[step].text}</Text>
          <TouchableOpacity onPress={handleNextStep} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  transparentOverlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: 'yellow',
    borderWidth: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
    alignItems: 'center', // Center the button within the speech bubble
  },
  tutorialText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10, // Add some space between text and button
  },
  nextButton: {
    backgroundColor: 'yellow', // Highlight the button
    padding: 10,
    borderRadius: 5,
    borderColor: 'black', // Add border color for highlight
    borderWidth: 2, // Add border width for highlight
  },
  nextButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default Tutorial;

