import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import Home from '../home';
import FocusSessionScreen from '../focus-session';

export default function ParentComponent() {
  const [sound, setSound] = useState(null);

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(
      soundFile,
      { isLooping: true }
    );
    setSound(sound);
    await sound.playAsync();
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const restartSound = async (soundFile) => {
    await stopSound();
    await playSound(soundFile);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <>
      <Home playSound={playSound} stopSound={stopSound} restartSound={restartSound} />
      <FocusSessionScreen playSound={playSound} stopSound={stopSound} restartSound={restartSound} />
    </>
  );
}
