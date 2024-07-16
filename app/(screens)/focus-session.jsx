import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, Platform, ImageBackground } from "react-native";
import { Picker } from "@react-native-picker/picker";
import NotificationPopup from '@/components/NotificationPopup';
import { FIRESTORE_DB, FIREBASE_AUTH } from '@/src/FirebaseConfig'; 
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Audio } from 'expo-av';
import SoundPicker from '@/components/SoundPicker';
import Currency from '../../components/currency';
import BackButton from '@/components/BackButton';
import { router } from 'expo-router';


const screen = Dimensions.get("window");
const formatNumber = number => `0${number}`.slice(-2);
const CURRENCY_INCREMENT = 5;

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = (start, end)=> {
  const arr = [];
  let i = start;
  while (i <= end) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_MINUTES = createArray(1, 120);

export default class FocusSessionScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    remainingSeconds: 0,
    remainingMinutes: 25,
    isRunning: false,
    selectedMinutes: "25",
    startTime: null,
    elapsedTime: 0,
    showNotification: false,
    sound: null,
    soundPickerVisible: false,
    selectedSound: { id: '1', name: 'Study', file: require('../../assets/music/lofi-study.mp3')},
    pearlCurrency: 0,
    shellCurrency: 0,
    initShell: 0,
    initPearl: 0,
    user: null,
  };

  interval = null;

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          this.setState({ 
            pearlCurrency: userSnapshot.data().pearlCurrency || 0,
            shellCurrency: userSnapshot.data().shellCurrency || 0,
          });
        } else {
          await setDoc(userDoc, { 
            pearlCurrency: 0,
            shellCurrency: 0,
          });
        }
        this.setState({ 
          user,
          initShell:userSnapshot.data().shellCurrency || 0,
          initPearl: userSnapshot.data().pearlCurrency || 0,
        });
      } else {
        this.setState({ user: null, pearlCurrency: 0, shellCurrency: 0 });
      }
    });
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
      //this.incrementCurrency('pearlCurrency');
      this.incrementCurrency('shellCurrency');
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.state.sound) {
      this.state.sound.unloadAsync();
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      this.state.selectedSound.file,
      { isLooping: true } 
    );
    this.setState({ sound });
    await sound.playAsync();
  };

  stopSound = async () => {
    if (this.state.sound) {
      await this.state.sound.stopAsync();
      await this.state.sound.unloadAsync();
      this.setState({ sound: null });
    }
  };

  start = async () => {
    startTime = Date.now();
    this.setState(state => ({
      remainingSeconds: parseInt(state.selectedMinutes, 10) * 60,
      isRunning: true,
      startTime,
    }));
    this.playSound();
    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1,
        elapsedTime: Date.now() - startTime,
      }));
    }, 1000);
  };

  pause = async () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.state.sound) {
      await this.state.sound.pauseAsync();
    }
  };

  resume = async () => {
    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1,
      }));
    }, 1000);
    if (this.state.sound) {
      await this.state.sound.playAsync();
    }
  };

  // stop = async () => {
  //   clearInterval(this.interval);
  //   this.interval = null;
  //   await this.recordTimeElapsed();
  //   this.stopSound();
  //   this.setState({
  //     remainingSeconds: 0,
  //     isRunning: false,
  //     startTime: null,
  //     elapsedTime: 0,
  //   });
  //   this.showNotification();
  // }; 

  stop = async () => {
    clearInterval(this.interval);
    this.interval = null;
    if (this.state.remainingSeconds === 0 && this.state.isRunning) {
      await this.recordTimeElapsed();
      //this.incrementCurrency('pearlCurrency');
      this.incrementCurrency('shellCurrency');
      this.showNotification();
    } else {
      this.stopSound();
      this.setState({
        isRunning: false,
        startTime: null,
        elapsedTime: 0,
      });
      this.showNotification();
    }
    
  };

  recordTimeElapsed = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const { startTime } = this.state;
      if (startTime) {
        const elapsedTime = Date.now() - startTime;
        try {
          const docRef = await addDoc(collection(FIRESTORE_DB, 'sessions'), {
            uid: user.uid,
            startTime: new Date(startTime),
            elapsedTime: elapsedTime / 1000,
          });
          console.log('Elapsed time saved to Firestore with ID:', docRef.id);
        } catch (error) {
          console.error('Error adding document:', error);
        }
        console.log(`Elapsed time: ${elapsedTime / 1000} seconds`);
      }
    } else {
      console.error('No user is signed in: sign in to save your record!');
    }
  };

  // showNotification = () => {
  //   console.log("Session ended, focus time recorded.");
  //   router.push('/end-focus-session');
  // };

 
  showNotification = () => {
    const { elapsedTime, initShell, pearlCurrency, shellCurrency } = this.state;
    const duration = elapsedTime / 1000 / 60; 
    const earnedShells = shellCurrency - initShell;
    this.stopSound();
    router.push({ pathname: "/end-focus-session", params: { duration, earnedShells }});
  };

  toggleNotification = () => {
    this.setState(state => ({
      showNotification: !state.showNotification,
    }), () => {
      if (this.state.showNotification) {
        this.pause();
      }
    });
  };

  handleStopAction = () => {
    this.toggleNotification();
    this.stop();
  };

  handleResume = () => {
    this.toggleNotification();
    this.resume();
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
    </View>
  );

  openSoundPicker = () => {
    this.setState({ soundPickerVisible: true });
  };

  closeSoundPicker = () => {
    this.setState({ soundPickerVisible: false });
  };

  selectSound = async sound => {
    await this.stopSound();
    this.setState({ selectedSound: sound, soundPickerVisible: false }, () => {
      if (this.state.isRunning) {
        this.playSound();
      }
    });
  };

  incrementCurrency = async type => {
    const { user, pearlCurrency, shellCurrency } = this.state;
    const newCurrency = type === 'pearlCurrency' ? pearlCurrency + CURRENCY_INCREMENT : shellCurrency + (CURRENCY_INCREMENT * 4);
    this.setState({ [type]: newCurrency });

    if (user) {
      const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
      await updateDoc(userDoc, { [type]: newCurrency });
    }
  };

  // incrementCurrency = async () => {
  //   const { user, pearlCurrency, shellCurrency } = this.state;
  //   const newShell = shellCurrency + CURRENCY_INCREMENT;
  //   // shellCurrency + (CURRENCY_INCREMENT * 4);
  //   this.setState({ shellCurrency : newShell });
  
  //   if (user) {
  //     const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
  //     await updateDoc(userDoc, { shellCurrency : newShell });
  //   }
  // };

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <ImageBackground source={require('../../assets/images/focussession.png')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.container}>
        <Currency pearl={this.state.pearlCurrency} shell={this.state.shellCurrency} />
          <StatusBar barStyle="light-content" />
          {this.state.isRunning ? (
            <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
          ) : (
            this.renderPickers()
          )}

          {this.state.isRunning ? (
            <TouchableOpacity onPress={this.toggleNotification} style={[styles.button, styles.buttonStop]}>
              <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.start} style={styles.button}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={this.openSoundPicker} style={styles.soundButton}>
            <Text style={styles.soundButtonText}>Select sound</Text>
          </TouchableOpacity>

          {this.state.showNotification && (
            <NotificationPopup
              message="End this session and give up? You will not get any reward.."
              onClose={this.handleResume}
              closeText="Go Back"
              onAction={this.handleStopAction}
              actionText="End now"
            />
          )}
          <SoundPicker
            visible={this.state.soundPickerVisible}
            onClose={this.closeSoundPicker}
            onSelect={this.selectSound}
          />
          <BackButton />
        </View>
      </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    borderWidth: 5,
    borderColor: "white",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#99fff",
  },
  buttonText: {
    fontSize: 45,
    color: "white",
    fontFamily: 'PlayfairDisplay',
  },
  buttonTextStop: {
    color: "#99fff",
  },
  timerText: {
    color: "white",
    fontSize: 75,
    fontFamily: 'PlayfairDisplay',
  },
  picker: {
    flex: 1,
    maxWidth: 100,
    ...Platform.select({
      android: {
        color: "white",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        fontFamily: 'PlayfairDisplay',
      },
    }),
  },
  pickerItem: {
    color: "white",
    fontSize: 28,
    fontFamily: 'PlayfairDisplay',
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      },
    }),
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  soundButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#0967a8',
    borderRadius: 8,
    alignItems: 'center',
  },
  soundButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'PlayfairDisplay'
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
