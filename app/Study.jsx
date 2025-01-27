import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';

export default function TabTwoScreen() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <View className="w-full h-full pt-3 px-5 flex bg-zinc-900">
      <View className="w-full h-full">
        <Text className="text-white font-[verdana] font-thin text-3xl text-center bg-zinc-800 rounded-md mt-2 p-3 pb-2 w-2/5 mx-auto">
          Deskname
        </Text>

        <Pressable
          className="flipcard w-full h-full"
          onPress={() => setIsFlipped(!isFlipped)}
        >
          <View className="grid grid-rows-2 h-[75%]">
            <View className="container mt-5 h-full p-5">
              {isFlipped ? (
                /**
                 * Back
                 */
                <View className="w-full h-[90%] flex justify-center">
                  <Text className="text-center text-white text-3xl">Definition of a word</Text>
                </View>
              ) : (

                /**
                 * Front
                 */
                <View className="w-full h-[90%] flex justify-center">
                  <Text className="text-center text-white text-5xl">
                    Word
                  </Text>
                </View>
              )}
              <Text className="border-t-2 border-transparent border-t-white normal-text pt-5">
                Click here to {isFlipped ? 'show front' : 'flip card'}
              </Text>
            </View>
          </View>
        </Pressable>

        <View className="w-full bg-zinc-700 mt-5 rounded-lg p-5 absolute bottom-5">
          <View className="flex-row justify-between">
            <Pressable
              className="pressable"
              onPress={() => console.log('Button 1 pressed')}
            >
              <Text className="button-text">Hard</Text>
            </Pressable>
            <Pressable
              className="pressable"
              onPress={() => console.log('Button 2 pressed')}
            >
              <Text className="button-text">Good</Text>
            </Pressable>
            <Pressable
              className="pressable"
              onPress={() => console.log('Button 3 pressed')}
            >
              <Text className="button-text">Easy</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
