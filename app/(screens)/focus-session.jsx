import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, Platform, ImageBackground } from "react-native";
import { Picker } from "@react-native-picker/picker";
import NotificationPopup from '@/components/NotificationPopup';
import { FIRESTORE_DB } from '@/src/FirebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Audio } from 'expo-av';
import SoundPicker from '@/components/SoundPicker';

const screen = Dimensions.get("window");
const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_MINUTES = createArray(120);

export default class FocusSessionScreen extends Component {
  state = {
    // initialize to 25 mins (pomodoro)
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
  };

  interval = null;

  // async componentDidMount() {
  //   const { sound } = await Audio.Sound.createAsync(require('../../assets/music/lofi-study.mp3'));
  //   this.setState({ sound });
  // }

  componentDidUpdate = (prevProp, prevState) => {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.state.sound) {
      this.state.sound.unloadAsync();
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

  stop = async () => {
    clearInterval(this.interval);
    this.interval = null;
    await this.recordTimeElapsed();
    this.stopSound();
    this.setState({
      remainingSeconds: 0,
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    });
    this.showNotification();
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


  // stop = async () => {
  //   clearInterval(this.interval);
  //   this.interval = null;
  //   const { startTime } = this.state;
  //   if (startTime) {
  //     const elapsedTime = Date.now() - startTime;
  //     try {
  //       const docRef = await addDoc(collection(FIRESTORE_DB, 'sessions'), {
  //         startTime: new Date(startTime),
  //         elapsedTime: elapsedTime/1000,
  //       });
  //       console.log('Elapsed time saved to Firestore with ID:', docRef.id);
  //     } catch (error) {
  //       console.error('Error adding data:', error);
  //     }
  //     console.log(`Elapsed time: ${elapsedTime/1000} seconds`);
  //   }
  //   this.setState({
  //     remainingSeconds: 5,
  //     isRunning: false,
  //     startTime: null,
  //     elapsedTime: 0,
  //   });
  //   this.showNotification();
  // };

  showNotification = () => {
    // do smth else here - show stats to user, open new notif popup?
    alert("Session ended, focus time recorded.")
  }

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
  }

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropDown"
      >
        {
          AVAILABLE_MINUTES.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))
        }
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
    </View>
  );

  openSoundPicker = () => {
    this.setState({ soundPickerVisible: true });
  }

  closeSoundPicker = () => {
    this.setState({ soundPickerVisible: false });
  }

  selectSound = async (sound) => {
    await this.stopSound();
    this.setState({ selectedSound: sound, soundPickerVisible: false }, () => {
      if (this.state.isRunning) {
        this.playSound();
      }
    });
  }

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <ImageBackground source={require('../../assets/images/focussession.png')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.container}>
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
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "4d94ff",
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
  },
  buttonTextStop: {
    color: "#99fff",
  },
  timerText: {
    color: "white",
    fontSize: 75,
  },
  picker: {
    flex: 1,
    maxWidth: 100,
    ...Platform.select({
      android: {
        color: "white",
        backgroundColor: "#90cdf8",
      },
    }),
  },
  pickerItem: {
    color: "white",
    fontSize: 28,
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
    marginTop: 20,
    padding: 12,
    backgroundColor: '#0967a8',
    borderRadius: 25,
    alignItems: 'center',
  },
  soundButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

