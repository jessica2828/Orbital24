// // import { useState } from "react";
// // import { router, usePathname } from "expo-router";
// // import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

// // const SearchInput = ({ initialQuery }) => {
// //   const pathname = usePathname();
// //   const [query, setQuery] = useState(initialQuery || "");

// //   return (
// //     <View className="flex flex-row items-center space-x-4 w-4/5 h-10 px-4 bg-black-100 rounded-full border-2 border-black-100 focus:border-primary">
// //       <TextInput
// //         className="text-base mt-0.5 text-white flex-1 font-playfair2"
// //         value={query}
// //         placeholder="Search friends"
// //         placeholderTextColor="#CDCDE0"
// //         //change the opacity of placeholder 
// //         onChangeText={(e) => setQuery(e)}
// //       />

// //       <TouchableOpacity
// //         onPress={() => {
// //           if (query === "")
// //             return Alert.alert(
// //               "Missing Query",
// //               "Please input something to search results across database"
// //             );

// //           if (pathname.startsWith("/search")) router.setParams({ query });
// //           else router.push(`/search/${query}`);
// //         }}
// //       >
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default SearchInput;


// import React, { useState } from "react";
// import { usePathname } from "expo-router";
// import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

// const SearchInput = ({ onSearch }) => {
//   const pathname = usePathname();
//   const [query, setQuery] = useState("");

//   const handleSearch = () => {
//     console.log('Searching...');
//     if (query === "") {
//       Alert.alert("Missing Query", "Please input something to search results across database.");
//     } else {
//       onSearch(query);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         value={query}
//         placeholder="Search friends"
//         placeholderTextColor="#CDCDE0"
//         onChangeText={(e) => setQuery(e)}
//       />
//       <TouchableOpacity onPress={handleSearch}>
//         <Image source={require('@/assets/images/search-icon.png')} style={styles.icon} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = {
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//     backgroundColor: '#333',
//     borderRadius: 25,
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//   },
//   icon: {
//     width: 20,
//     height: 20,
//     marginLeft: 10,
//   },
// };

// export default SearchInput;