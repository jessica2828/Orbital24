import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-4/5 h-10 px-4 bg-black-100 rounded-full border-2 border-black-100 focus:border-primary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-playfair2"
        value={query}
        placeholder="Search friends"
        placeholderTextColor="#CDCDE0"
        //change the opacity of placeholder 
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;