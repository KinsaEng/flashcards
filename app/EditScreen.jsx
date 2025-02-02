import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditScreen() {
  {/* Home */}
  const router = useRoute();
  const [lastIndex, setLastIndex] = useState(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [editInputs, seteditInputs] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDelVisible, setIsDelVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  {/* EditScreen */}
  const [globalDeckIndex, setDeckIndex] = useState(null);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState(null);

  const handleFrontChange = (text, cardIndex) => handleCardChange(text, cardIndex, 'front');
  const handleBackChange = (text, cardIndex) => handleCardChange(text, cardIndex, 'back');

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        if (storedDecks) {
          const parsedDecks = JSON.parse(storedDecks);
  
          parsedDecks.forEach(deck => {
            if (deck.cards) {
              deck.cards = deck.cards.filter(card => card.front || card.back);
            }
          });
  
          setDecks(parsedDecks);
        }
      } catch (error) {
        console.error('Failed to load decks from storage', error);
      }
    };
    loadDecks();

    if (router.params?.deckIndex !== undefined) {
      setDeckIndex(router.params.deckIndex);
      setDeckName(router.params.deckName);
      
      const receivedDecks = router.params.decks || [];
      if (receivedDecks[router.params.deckIndex]?.cards === undefined) {
        receivedDecks[router.params.deckIndex].cards = [];
      }
      
      setDecks(receivedDecks);
    }
  }, [router.params]);

  // function getIndex(){
  //   return globalDeckIndex;
  // }

  const renderCards = () => {
    const deckIndex = router.params.deckIndex;
    if (deckIndex == null || !decks[deckIndex]?.cards) {
      return null;
    }
  
    let cards = [...decks[deckIndex].cards];
  
    const lastCard = cards[cards.length - 1];
    console.log(decks)
    if ((lastCard.front || lastCard.back) && (cards.length === 0 || cards[cards.length - 1].front !== "" || cards[cards.length - 1].back !== "")) {
      cards.push({ front: "", back: "" });
    }
  
    cards = cards.filter((card, index) => {
      if (index !== cards.length - 1) {
        return card.front || card.back;
      }
      return true;
    });
  
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
  
  const handleCardChange = (text, cardIndex, field) => {
    const updatedDecks = [...decks];
    
    if (!updatedDecks[router.params.deckIndex].cards[cardIndex]) {
      updatedDecks[router.params.deckIndex].cards.push({ front: "", back: "" });
    }
  
    updatedDecks[router.params.deckIndex].cards[cardIndex][field] = text;
  
    updatedDecks[router.params.deckIndex].cards = updatedDecks[router.params.deckIndex].cards.filter((card, index, cards) => {
      if (index !== cards.length - 1) {
        return card.front || card.back;
      }
      return true;
    });
  
    setDecks(updatedDecks);
  
    AsyncStorage.setItem('decks', JSON.stringify(updatedDecks)).catch(error => {
      console.error('Failed to save updated decks:', error);
    });
  };
  
  
  const handleAddCard = () => {
    const deckIndex = router.params.deckIndex;
    if (deckIndex !== null) {
      setDecks(prevDecks => {
        const updatedDecks = [...prevDecks]; 
        const deck = { ...updatedDecks[deckIndex] }; 
        deck.cards = [...deck.cards, { front: "", back: "" }];
  
        updatedDecks[deckIndex] = deck;
  
        AsyncStorage.setItem('decks', JSON.stringify(updatedDecks)).catch(error => {
          console.error('Failed to save updated decks:', error);
        });
  
        return updatedDecks;
      });
    }
  };
  
  

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

  const handleDeleteCard = () => {
    const deckIndex = router.params.deckIndex;
    if (deckIndex !== null) {
      const updatedDecks = [...decks];
      const deck = updatedDecks[deckIndex];
  
      if (deck.cards && deck.cards.length > 1) {
        deck.cards.splice(deck.cards.length - 1, 1);
        setDecks(updatedDecks); 
        
        AsyncStorage.setItem('decks', JSON.stringify(updatedDecks)).catch(error => {
          console.error('Failed to save updated decks:', error);
        });
      }
    }
  };

  function setIndex(index) {
    setLastIndex(index);
  }
  
  function getIndex(){
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
    

    <View className="w-full h-full pt-6 px-5 flex bg-zinc-900">
    {/* Edit Menu */}
      <Text className="text-white font-[verdana] font-black text-5xl text-center bg-zinc-800 rounded-md p-3 pb-2 flex w-fit mx-auto">
        {
          router.params.name
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
  );
}

