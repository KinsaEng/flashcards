import { Image, StyleSheet, Platform, View, Text, Button, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const openContextMenu = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    console.log("X: ",pageX)
    if( pageX >200){
      setMenuPosition({ x: pageX-200, y: pageY });
    }else{
      setMenuPosition({ x: pageX, y: pageY });
    }
    setIsContextMenuVisible(true);
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


  return (
    

    <View id='body' className="w-full h-full pt-16 px-5 flex bg-zinc-900">

      <Modal
        visible={isPopupVisible}
        animationType="slide"
        transparent={true}
        className='popup'
        onRequestClose={() => setIsPopupVisible(false)} // Modal'ı kapat
      >
        <View className="popup flex-1 justify-center">
          <View className="container w-[70%] mx-auto gap-2 p-5">
            <TextInput
              value={newDeckName}
              onChangeText={setNewDeckName}
              placeholder="New Deck Name"
              placeholderTextColor="#999"
              className="text-white bg-zinc-900 p-3 rounded-md text-lg"
            />
            <Button title="Add Deck" onPress={handleAddDeck} />
            <Button title="Cancel" onPress={() => setIsPopupVisible(false)} />
          </View>
        </View>
      </Modal>

      

      <Text className="text-white font-[verdana] font-black text-5xl text-center bg-zinc-800 rounded-md p-3 pb-2 flex w-2/5 mx-auto">
        Decks
      </Text>
      

      {/* Long Press Area */}
      <View className="mt-5">
        
        
        {decks.map((deck, index) => (
          
          <TouchableOpacity
            className=" bg-zinc-800 rounded-md mt-2 p-3 pb-2 h-12"
            onLongPress={openContextMenu}
            onPress={route}
            >
            <Link
              key={index}
              onLongPress={openContextMenu}
              className='text-white font-[verdana] font-thin text-3xl text-start'
              href={`/Study/${deck.name}`}
            >
              {deck.name}
            </Link>
          </TouchableOpacity>
        ))}

        


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
                  <Text className="text-white">Option 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeContextMenu();
                    console.log("Option 2 Selected");
                  }}
                  className="p-2"
                >
                  <Text className="text-white">Option 2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeContextMenu();
                    console.log("Option 3 Selected");
                  }}
                  className="p-2"
                >
                  <Text className="text-white">Option 3</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
        </Modal>

      </View>

      <View className="absolute bottom-10 right-10 text-xl">
          <Button className="text-5xl" title="+" onPress={() => setIsPopupVisible(true)} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  

});
