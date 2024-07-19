// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
// import { doc, getDoc } from 'firebase/firestore';
// import { FIRESTORE_DB } from '@/src/FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import BackButton from '@/components/BackButton';
// import { getStatusBarHeight } from 'react-native-status-bar-height';
// import { BarChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';

// const OverviewPage = () => {
//   const [focusSessions, setFocusSessions] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [totalDuration, setTotalDuration] = useState(0);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setCurrentUserId(user.uid);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (currentUserId) {
//       fetchFocusSessions();
//     }
//   }, [currentUserId, selectedDate]);

//   const fetchFocusSessions = async () => {
//     const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
    
//     try {
//       const userDoc = doc(FIRESTORE_DB, 'users', currentUserId);
//       const userSnapshot = await getDoc(userDoc);
//       if (userSnapshot.exists()) {
//         const sessions = userSnapshot.data().sessions || [];
//         const filteredSessions = sessions.filter(session => {
//           const sessionDate = session.startTime.toDate();
//           return sessionDate >= startOfDay && sessionDate <= endOfDay;
//         });
//         setFocusSessions(filteredSessions);
//         const total = filteredSessions.reduce((sum, session) => sum + session.elapsedTime, 0);
//         setTotalDuration(Math.round(total / 60));  
//       }
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//     }
//   };

//   const getChartData = () => {
//     const hours = Array(24).fill(0);
//     focusSessions.forEach(session => {
//       const sessionHour = new Date(session.startTime.seconds * 1000).getHours();
//       hours[sessionHour] += session.elapsedTime;
//     });
  
//     return {
//       labels: Array.from({ length: 25 }, (_, i) => (i % 3 === 0 ? i.toString().padStart(2, '0') + '.00' : '')),
//       datasets: [
//         {
//           data: hours.map(time => Math.round(time/60)),
//         },
//       ],
//     };
//   };
  

//   return (
//     <ImageBackground source={require('@/assets/images/indoor.png')} style={styles.backgroundImage}>
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <Text style={styles.title}>Focus Session Overview</Text>
//         <View style={styles.datePickerContainer}>
//           <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//             <Text style={styles.datePickerText}>Select Date: {selectedDate.toLocaleDateString()}</Text>
//           </TouchableOpacity>
//           {showDatePicker && (
//             <DateTimePicker
//               value={selectedDate}
//               mode="date"
//               display="default"
//               onChange={(event, date) => {
//                 setShowDatePicker(false);
//                 if (date) {
//                   setSelectedDate(date);
//                 }
//               }}
//               textColor="white" 
//           themeVariant="dark" 
//             />
//           )}
//         </View>
//         <Text style={styles.totalDuration}>Total Duration: {totalDuration} minutes</Text>
//         <ScrollView>
//           <BarChart
//             data={getChartData()}
//             width={Dimensions.get('window').width - 60} 
//             height={190}
//             yAxisLabel=""
//             yAxisSuffix="min"
//             chartConfig={{
//               backgroundColor: 'white',
//               backgroundGradientFrom: '#0d0d0d',
//               backgroundGradientTo: '#0d0d0d',
//               decimalPlaces: 0, 
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//               propsForDots: {
//                 r: '6',
//                 strokeWidth: '1',
//                 stroke: '#0d0d0d',
//               },
//             }}
//             style={{
//               marginVertical: 10,
//               paddingLeft: 0,
//               paddingRight: 55,
//           //     marginHorizontal: 10, // Adjust horizontal margin
//           // paddingLeft: 30, // Add padding to the left
//           // paddingRight: 30, // Add padding to the right
//               borderRadius: 8,
//             }}
//           />
//         </ScrollView>
//         <BackButton />
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     marginTop: 100 + getStatusBarHeight(),
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     fontFamily: 'PlayfairDisplay',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: 'white',
//   },
//   datePickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   datePickerText: {
//     fontSize: 18,
//     color: 'white',
//     fontFamily: 'PlayfairDisplay',
//   },
//   totalDuration: {
//     fontSize: 20,
//     fontFamily: 'PlayfairDisplay',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
// });

// export default OverviewPage;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/src/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '@/components/BackButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const OverviewPage = () => {
  const [focusSessions, setFocusSessions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalDuration, setTotalDuration] = useState(0);

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
  }, [currentUserId, selectedDate]);

  const fetchFocusSessions = async () => {
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
    
    try {
      const userDoc = doc(FIRESTORE_DB, 'users', currentUserId);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const sessions = userSnapshot.data().sessions || [];
        const filteredSessions = sessions.filter(session => {
          const sessionDate = session.startTime.toDate();
          return sessionDate >= startOfDay && sessionDate <= endOfDay;
        });
        setFocusSessions(filteredSessions);
        const total = filteredSessions.reduce((sum, session) => sum + session.elapsedTime, 0);
        setTotalDuration(Math.round(total / 60));  
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const getChartData = () => {
    const hours = Array(24).fill(0);
    focusSessions.forEach(session => {
      const sessionHour = new Date(session.startTime.seconds * 1000).getHours();
      hours[sessionHour] += session.elapsedTime;
    });
  
    return {
      labels: Array.from({ length: 25 }, (_, i) => (i % 3 === 0 ? i.toString().padStart(2, '0') + '.00' : '')),
      datasets: [
        {
          data: hours.map(time => Math.round(time / 60)),
        },
      ],
    };
  };
  
  return (
    <ImageBackground source={require('@/assets/images/indoor.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Focus Session Overview</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Select Date:</Text>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            textColor="white" 
            themeVariant="dark" 
            style={styles.datePicker}
          />
        </View>
        <Text style={styles.totalDuration}>Total Duration: {totalDuration} minutes</Text>
        <ScrollView>
          <BarChart
            data={getChartData()}
            width={Dimensions.get('window').width - 60}
            height={190}
            yAxisLabel=""
            yAxisSuffix="min"
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: '#0d0d0d',
              backgroundGradientTo: '#0d0d0d',
              decimalPlaces: 0, 
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '1',
                stroke: '#0d0d0d',
              },
            }}
            style={{
              marginVertical: 10,
              paddingLeft: 10,
              paddingRight: 55,
              borderRadius: 8,
            }}
          />
        </ScrollView>
        <BackButton />
      </View>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerLabel: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'PlayfairDisplay',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  datePicker: {
    flex: 1,
    fontFamily: 'PlayfairDisplay',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 90,
    width: 200, 
    height: 40, 
  },
  totalDuration: {
    fontSize: 17,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default OverviewPage;

