import { Image, StyleSheet, Platform, View, Text, Button, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const [lastIndex, setLastIndex] = useState(null);
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDelVisible, setIsDelVisible] = useState(false);
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const openContextMenu = (event) => {
    const { pageX, pageY } = event.nativeEvent;

    if(!isContextMenuVisible){
      if( pageX >200){
        setMenuPosition({ x: pageX-200, y: pageY });
      }else{
        setMenuPosition({ x: pageX, y: pageY });
      }
      setIsContextMenuVisible(true);
    }
  };

  const closeContextMenu = () => {
    setIsContextMenuVisible(false);
  };

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        if (storedDecks) {
          setDecks(JSON.parse(storedDecks));
        }
      } catch (error) {
        console.error('Failed to load decks from storage', error);
      }
    };
    loadDecks();
  }, []);

  const handleAddDeck = async () => {
    if (newDeckName.trim()) {
      const newDecks = [...decks, { name: newDeckName, cards: [] }];
      setDecks(newDecks);
      setNewDeckName('');
      setIsPopupVisible(false);
      try {
        await AsyncStorage.setItem('decks', JSON.stringify(newDecks));
      } catch (error) {
        console.error('Failed to save decks to storage', error);
      }
    }
  };

  


  function setIndex(index) {
    setLastIndex(index);
  }
  
  
  function getIndex() {
    return lastIndex;
  }
  
  function resetIndex() {
    setLastIndex(915389012983);
  }
  

  function delDeck() {
    console.log("silindi " + lastIndex);
    if (lastIndex !== null) {
      const updatedDecks = decks.filter((_, i) => i !== lastIndex);
      setDecks(updatedDecks);
      setLastIndex(null);
      AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
    }
  }

  return (
    

    <View className="w-full h-full pt-16 px-5 flex bg-zinc-900">

      <Text className="text-white font-[verdana] font-black text-5xl text-center bg-zinc-800 rounded-md p-3 pb-2 flex w-2/5 mx-auto">
        Decks
      </Text>


      {/* Decks */}
      
      {decks.map((deck, index) => (
        
        <View className="mt-1"
          key={index}
        >
            <TouchableOpacity
                className=" bg-zinc-800 rounded-md mt-2 p-4 h-fit"
                  onLongPress={(event) => {openContextMenu(event); setIndex(index);}}
              >
              <Link
                onLongPress={(event) => { openContextMenu(event); setIndex(index);}}
                className='text-white font-[verdana] font-thin text-3xl text-start'
                href={`/Study/${deck.name}`}
              >
                {deck.name}
              </Link>
            </TouchableOpacity>
        </View>
      ))}
        

      <View className="absolute bottom-10 right-10 text-xl">
          <Pressable className="bg-blue-500 p-2 w-12 h-12 flex justify-center rounded-lg" title="+" onPress={() => setIsPopupVisible(true)} >
            <Text className='text-5xl text-center text-white'>+</Text>
          </Pressable>
      </View>

      {/* Context Menu*/}
      <Modal
          visible={isContextMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={closeContextMenu}
        >
          <TouchableWithoutFeedback onPress={closeContextMenu}>
            <BlurView 
            intensity={1}
            experimentalBlurMethod='dimezisBlurView'
            tint='dark'
            className="flex-1 w-screen h-screen">
              <View
                style={{
                  position: "absolute",
                  top: menuPosition.y,
                  left: menuPosition.x,
                }}
                className="bg-zinc-800 p-3 outline rounded-lg  shadow-[0_0px_15px_rgb(255,255,255,0.5)] w-[200px]"
              >
                <TouchableOpacity
                  onPress={() => {
                    closeContextMenu();
                    console.log("Option 1 Selected");
                  }}
                  className="p-2"
                >
                  <Text className="text-white">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeContextMenu();
                    console.log("Option 2 Selected");
                  }}
                  className="p-2"
                >
                  <Text className="text-white" onPress={() => setIsDelVisible(true)}>Delete</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
      </Modal>

      
      <Modal
          visible={isDelVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDelVisible(false)}
        >
          <TouchableWithoutFeedback >
            <BlurView 
            intensity={1}
            experimentalBlurMethod='dimezisBlurView'
            tint='dark'
            className="flex-1 w-screen h-screen justify-center">
              <View
                className="
                bg-zinc-800 p-3 outline rounded-lg  shadow-[0_0px_15px_rgb(255,255,255,0.5)] w-96
                  mx-auto 
                "
              >
                <View className="container w-full mx-auto gap-2 p-1 ">
                  <Text
                    value={newDeckName}
                    onChangeText={setNewDeckName}
                    placeholder="New Deck Name"
                    placeholderTextColor="#999"
                    className="text-red-200 text-center p-3 rounded-md text-3xl grid grid-cols-2"
                  > Are you sure you want to delete </Text>

                  <View className='w-full flex-row'>
                    <Pressable className='w-1/2 p-1' title="Add Deck" onPress={() => {setIsDelVisible(false); closeContextMenu(); resetIndex}} >
                      <Text className='w-full inline-block bg-zinc-500 p-2 text-center text-2xl text-white font-black rounded-lg' >
                        Cancel
                      </Text>
                    </Pressable>

                    <Pressable className='w-1/2 p-1' title="Cancel" onPress={() => {delDeck(getIndex()); closeContextMenu(); setIsDelVisible(false)}} >
                      <Text className='w-full inline-block bg-red-500 p-2 text-center text-2xl text-white font-black rounded-lg' >
                        Delete
                      </Text> 
                    </Pressable>
                  </View>
                  
                </View>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
      </Modal>

      <Modal
          visible={isPopupVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsPopupVisible(false)}>
            <BlurView 
            intensity={1}
            experimentalBlurMethod='dimezisBlurView'
            tint='dark'
            className="flex-1 w-screen h-screen justify-center">
              <View
                className="
                bg-zinc-800 p-3 outline rounded-lg  shadow-[0_0px_15px_rgb(255,255,255,0.5)] w-96
                  mx-auto 
                "
              >
                <View className="container w-full mx-auto gap-2 p-5">
                  <TextInput
                    value={newDeckName}
                    onChangeText={setNewDeckName}
                    placeholder="New Deck Name"
                    placeholderTextColor="#999"
                    className="text-white bg-zinc-900 p-3 rounded-md text-xl"
                  />
                  <Pressable title="Add Deck" onPress={handleAddDeck} >
                    <Text className='w-full bg-blue-500 p-2 text-center text-2xl text-white font-black rounded-lg' >Add Deck</Text>
                  </Pressable>

                  <Pressable title="Cancel" onPress={() => setIsPopupVisible(false)} >
                    <Text className='w-full bg-blue-500 p-2 text-center text-2xl text-white font-black rounded-lg' >Cancel</Text> 
                  </Pressable>
                </View>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  

});
