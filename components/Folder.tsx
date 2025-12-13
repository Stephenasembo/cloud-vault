import { Pressable, View, Text, StyleSheet, Alert } from "react-native"
import { useFoldersContext } from "../context/FoldersContext";


export type FolderCardProps = {
  folderName: string;
  folderId: string;
}

export default function FolderCard ({ folderName, folderId }: FolderCardProps) {
  const { deleteUserFolder } = useFoldersContext();

  async function handleDelete(id: string) {
    const message = await deleteUserFolder(id);
    Alert.alert(
      message
    )
  }

  return (
    <Pressable
    style={styles.card}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text>{folderName}</Text>
        <Pressable
        style={styles.button}
        >
          <Text>Open</Text>
        </Pressable>
        <Pressable
        style={styles.button}
        >
          <Text>Edit</Text>
        </Pressable>
        <Pressable
        style={styles.button}
        onPress={() => handleDelete(folderId)}
        >
          <Text>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '100%',
  },
  button : {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
  }
})