import { Pressable, View, Text, StyleSheet } from "react-native"

export type FolderCardProps = {
  folderName: string;
}

export default function FolderCard ({ folderName }: FolderCardProps) {
  return (
    <Pressable
    style={styles.card}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text>{folderName}</Text>
        <Pressable
        style={{ borderWidth: 1, padding: 10, borderRadius: 16 }}
        >
          <Text>Open</Text>
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
})