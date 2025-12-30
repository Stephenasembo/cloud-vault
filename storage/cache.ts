import AsyncStorage from '@react-native-async-storage/async-storage';

export async function addIndex(key: string, id: string) {
  const storedIndex = await AsyncStorage.getItem(key);
  let newIndex: string[];

  if(!storedIndex) {
    newIndex = [];
  } else {
    newIndex = JSON.parse(storedIndex);
  }

  if(!(newIndex.includes(id))) {
    newIndex.push(id);
    await AsyncStorage.setItem(key, JSON.stringify(newIndex));
  }
}
