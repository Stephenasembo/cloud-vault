import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function FolderScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Welcome to the folder screen</Text>
      <Text>This folder's id is:</Text>
      <Text>{id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})