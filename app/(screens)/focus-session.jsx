import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Platform,
    ImageBackground
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const screen = Dimensions.get("window");
const formatNumber = number => `0${number}` . slice(-2);


const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return {minutes: formatNumber(minutes), seconds: formatNumber(seconds)}
}

const createArray = length => {
  const arr = [];
  let i = 0;
  while(i < length){
    arr.push(i.toString());
    i += 1;
  }
  return arr;
}

const AVAILABLE_MINUTES = createArray(120);

export default class FocusSessionScreen extends Component {
  state = {
    // initialize 25 mins timer if user did not specify
    remainingSeconds: 0,
    remainingMinutes: 25,
    isRunning: false,
    selectedMinutes: "25",
  }

  interval = null;

  //change the state of the timer

  componentDidUpdate = (prevProp, prevState) => {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0){
      this.stop();
    }
  }

  componentWillUnmount() {
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds: 
        parseInt(state.selectedMinutes, 10) * 60,
        isRunning: true
    }));
    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }));
    }, 1000);
  }

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 5,
      isRunning: false
    })
  }

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={itemValue => {
          this.setState({selectedMinutes: itemValue});
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

  render() {
    const {minutes, seconds} = getRemaining(this.state.remainingSeconds);
    return(
      <ImageBackground source={ require('../../assets/images/focussession.png')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                {
                this.state.isRunning ? (
                    <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
                ) : (
                    this.renderPickers()
                )
                }
                {
                this.state.isRunning ? (
                    <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
                        <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={this.start} style={styles.button}>
                        <Text style={styles.buttonText}>Start</Text>
                    </TouchableOpacity>
                )
                }
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
        justifyContent: "center"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent:  'center', 
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
        marginTop: 30
      },
      buttonStop: {
        borderColor: "#99fff"
      },
      buttonText: {
        fontSize: 45,
        color: "white"
      },
      buttonTextStop: {
        color: "#99fff"
      },
      timerText: {
        color: "white",
        fontSize: 75
      },
      picker: {
        flex: 1,
        maxWidth: 100,
        ...Platform.select({
          android: {
            color: "white",
            backgroundColor: "rgba(92, 92, 92, 0.206)",
          }
        })
      },
      pickerItem: {
        color: "white",
        fontSize: 28,
        ...Platform.select({
          android: {
            marginLeft: 10,
            marginRight: 10,
          }
        })
      },
      pickerContainer: {
        flexDirection: "row",
        alignItems: "center"
      }
});
