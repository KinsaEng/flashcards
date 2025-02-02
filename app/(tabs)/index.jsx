import { 
  Image, StyleSheet, Platform, View, Text
  , Button, TextInput, Modal, TouchableOpacity
  , TouchableWithoutFeedback, Pressable, TouchableHighlight
  , ScrollView

 } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const handleFrontChange = (text, cardIndex) => handleCardChange(text, cardIndex, 'front');
  const handleBackChange = (text, cardIndex) => handleCardChange(text, cardIndex, 'back');
  const navigation = useNavigation()

  const [editInputs, seteditInputs] = useState([]);
  const [lastIndex, setLastIndex] = useState(null);
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDelVisible, setIsDelVisible] = useState(false);
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  function routeToEdit(){
    navigation.navigate("EditScreen",{
      deckIndex: getIndex(),
      name: decks[getIndex()] ? decks[getIndex()]["name"] : "An error occured",
      decks: decks,
      cards: decks[getIndex()]
    })
  }


  function routeToStudy(){
    navigation.navigate("EditScreen",{
      deckIndex: getIndex(),
      name: decks[getIndex()] ? decks[getIndex()]["name"] : "An error occured",
      decks: decks,
      cards: decks[getIndex()]
    })
  }
/**
  const renderCards = () => {
    const deckIndex = getIndex();
    if (deckIndex === null || !decks[deckIndex]?.cards) {
      return null;
    }
  
    let cards = [...decks[deckIndex].cards];
  
    cards = cards.filter((card, index) => {
      if (index === cards.length - 1) {
        return true;
      }
      return card.front.trim() !== "" || card.back.trim() !== "";
    });
  
    if (cards.length === 0) {
      cards.push({ front: "", back: "" });
    }
  
    if (cards[cards.length - 1]?.front !== "" || cards[cards.length - 1]?.back !== "") {
      handleAddCard();
    }
  
    return cards.map((card, index) => (
      <View key={index} className="w-full h-14 mt-4 flex-row justify-start">
        <TextInput
          value={card.front}
          onChangeText={(text) => handleFrontChange(text, index)}
          className="w-1/2 text-2xl font-black text-white px-2 bg-zinc-800 rounded-md rounded-r-none border-r-2 border-zinc-900"
          placeholder="Front"
          placeholderTextColor="gray"
        />
        <TextInput
          value={card.back}
          onChangeText={(text) => handleBackChange(text, index)}
          className="w-1/2 text-2xl font-black text-white px-2 bg-zinc-800 rounded-md rounded-l-none"
          placeholder="Back"
          placeholderTextColor="gray"
        />
      </View>
    ));
  };
  
  
  const handleAddCard = () => {
    const deckIndex = getIndex();
    if (deckIndex !== null) {
      const updatedDecks = [...decks];
      const deck = updatedDecks[deckIndex];
  
      if (!deck.cards) {
        deck.cards = [];
      }
  
      deck.cards.push({ front: "", back: "" });
      setDecks(updatedDecks);
  
      AsyncStorage.setItem('decks', JSON.stringify(updatedDecks)).catch(error => {
        console.error('Failed to save updated decks:', error);
      });

    }
  };
  
  function openEditMenu(index){

    setIsEditVisible(true)
  }
  */

  const openContextMenu = (event) => {
    const { pageX, pageY } = event.nativeEvent;

    if(!isContextMenuVisible){
      if( pageX >280){
        setMenuPosition({ x: pageX-120, y: pageY });
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
          const parsedDecks = JSON.parse(storedDecks);
  
          parsedDecks.forEach(deck => {
            if (deck.cards) {
              deck.cards = deck.cards.filter(card => card.front.trim() !== "" || card.back.trim() !== "");
            }
          });
  
          setDecks(parsedDecks);
        }
      } catch (error) {
        console.error('Failed to load decks from storage', error);
      }
    };
    loadDecks();
  }, []);


  const handleAddDeck = async () => {
    if (newDeckName.trim()) {
      const newDecks = [
        ...decks,
        {
          name: newDeckName,
          cards: [{ front: "", back: "" }]
        }
      ];
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

  /**
    const handleDeleteCard = () => {
    const deckIndex = getIndex();
    if (deckIndex !== null) {
      const updatedDecks = [...decks];
      const deck = updatedDecks[deckIndex];
  
      if (deck.cards && deck.cards.length > 2) {
        deck.cards.splice(deck.cards.length - 2, 1);
        setDecks(updatedDecks); 
        
        AsyncStorage.setItem('decks', JSON.stringify(updatedDecks)).catch(error => {
          console.error('Failed to save updated decks:', error);
        });
      }
    }
  };
  */
  
  
  const handleCardChange = (text, cardIndex, field) => {
    const updatedDecks = [...decks];
    updatedDecks[getIndex()].cards[cardIndex][field] = text;

    updatedDecks[getIndex()].cards = updatedDecks[getIndex()].cards.filter((card, index, cards) => {
      if (index === cards.length - 1) {
        return true;
      }
      return card.front.trim() !== "" || card.back.trim() !== "";
    });

    setDecks(updatedDecks);

    AsyncStorage.setItem('decks', JSON.stringify(updatedDecks)).catch(error => {
      console.error('Failed to save updated decks:', error);
    });
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
                onPress={() => {router.push('/Study')} }
                onLongPress={(event) => {openContextMenu(event); setIndex(index);}}
              >
                <Text className='text-white font-[verdana] font-thin text-3xl text-start'>
                  {deck.name}
                </Text>
            </TouchableOpacity>
        </View>
      ))}
        
      {/* New Deck Button*/}
      <TouchableHighlight className="absolute bottom-10 right-10 text-xl bg-blue-500 p-2 w-12 h-12 flex justify-center rounded-lg" title="+" onPress={() => setIsPopupVisible(true)} >
        <Text className='text-5xl text-center text-white'>+</Text>
      </TouchableHighlight>

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
                className="bg-zinc-800 p-2 outline rounded-lg w-36 shadow-[0_0px_15px_rgb(255,255,255,0.5)]"
              >
                <TouchableOpacity
                  onPress={() => {
                    closeContextMenu();
                    
                      {/* ROUTER */}
                      routeToEdit()


                  }}
                  className="p-3 flex-row"
                >
                  <Text className="text-white text-end text-2xl mr-auto" onPress={() => {
                    closeContextMenu();
                  }}>
                      Edit
                  </Text>
                  <FontAwesome6 className='text-white' name="edit" size={22} color="#60a5fa" />
                  
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeContextMenu();
                    setIsDelVisible(true)
                  }}
                  className="p-3 flex-row border-white/90 border-t-[1px]"
                >
                  <Text className="text-white text-end text-2xl mr-auto " onPress={() => {
                    closeContextMenu();
                    setIsDelVisible(true)
                  }}>
                    Delete
                  </Text>
                  <FontAwesome6 className='text-white' name="trash-can" size={22} color="#f87171" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
      </Modal>

      {/* Del Deck Menu*/}
      <Modal
          visible={isDelVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDelVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDelVisible(false)} >
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

      {/* New Deck Menu*/}
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

                  <Pressable title="Add Deck" onPress={handleAddDeck}>
                    <Text className='w-full bg-blue-500 p-2 text-center text-2xl text-white font-black rounded-lg' >Add Deck</Text>
                  </Pressable>

                  <TouchableHighlight title="Cancel" animationType="" onPress={() => setIsPopupVisible(false)} >
                    <Text className='w-full bg-blue-500/70 p-2 text-center text-2xl text-white font-black rounded-lg' >Cancel</Text> 
                  </TouchableHighlight>
                </View>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Menu */}
      {/* <Modal
          visible={isEditVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditVisible(false)}
        >
          <View className="absolute top-0 left-0 w-screen h-screen pt-6 px-5 flex bg-zinc-900">
            <Text className="text-white font-[verdana] font-black text-5xl text-center bg-zinc-800 rounded-md p-3 pb-2 flex w-fit mx-auto">
              {
                decks[getIndex()] ? decks[getIndex()]["name"] : "An error occured"
              }
            </Text>
            
            <ScrollView className="mt-4">
              {renderCards()}
            </ScrollView>

            <View className='absolute flex justify-center mx-auto w-screen bottom-5'>
              <TouchableOpacity className="text-xl w-[90%] mx-auto bg-blue-500 p-2 flex justify-center rounded-lg" title="Add Card"
               onPress={handleDeleteCard}>
                <Text className='text-2xl text-center text-white font-black w-full'>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal> */}

    </View>
  );
}

const styles = StyleSheet.create({
  

});
