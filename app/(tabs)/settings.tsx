import { StyleSheet, Image, Platform, View, Text, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

export default function TabTwoScreen() {
  return (
    <View className='w-full h-full pt-16 px-5 flex bg-zinc-900'>
    <Text className='text-white font-[verdana] font-black text-5xl text-center bg-zinc-800 rounded-md p-3 pb-2 flex w-2/5 mx-auto'>
      Settings
    </Text>

    <View>
      {
      /* decks.forEach(deck => {
        
      }); */}
      <Text className='text-white font-[verdana] font-thin text-3xl text-start bg-zinc-800 rounded-md mt-2 p-3 pb-2'>
        Language
      </Text>
      <Link href={'/Import'} className='text-white font-[verdana] font-thin text-3xl text-start bg-zinc-800 rounded-md mt-2 p-3 pb-2'>
        Import
      </Link>
      <Text className='text-white font-[verdana] font-thin text-3xl text-start bg-zinc-800 rounded-md mt-2 p-3 pb-2'>
        Export
      </Text>

    </View>
</View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
