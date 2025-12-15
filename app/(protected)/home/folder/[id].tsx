import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { uploadFile } from '../../../../services/storage';
import { useAuthContext } from '../../../../context/AuthContext';

export default function FolderScreen() {
  const { userId } = useAuthContext();
  const { id } = useLocalSearchParams<{ id: string }>();

  async function handleUpload(): Promise<void> {
    if(!userId) return;
    const message = await uploadFile(userId, id);
    Alert.alert(
      message
    )
  }
 
  return (
    <View style={styles.container}>
      <Text>Welcome to the folder screen</Text>
      <Text>This folder's id is:</Text>
      <Text>{id}</Text>
      <Pressable
      style={styles.addButton}
      onPress={handleUpload}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    fontSize: 44,
    color: 'white'
  },

})