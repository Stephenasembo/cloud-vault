import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Dispatch, SetStateAction, useMemo } from "react";
import Popover from "react-native-popover-view";
import { FileObject } from '@supabase/storage-js';
import { deleteFile, shareFile } from "../services/storage";
import { Placement, Point } from 'react-native-popover-view/dist/Types'

export type MenuType = {
  userId: string;
  folderId: string;
  name: string;
  fileId: string;
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  setFiles: Dispatch<SetStateAction<FileObject[] | []>>;
  coordinates: { x: number, y: number};
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function MenuPopover({
  userId,
  folderId,
  name,
  fileId,
  menuVisible,
  setMenuVisible,
  setFiles,
  coordinates,
  setModalVisible,
}: MenuType) {

  const point = useMemo(() => new Point(coordinates.x, coordinates.y),
  [coordinates.x, coordinates.y]);

  async function handleDelete() {
    setMenuVisible(false);
    const filePath = `public/${userId}/${folderId}/${name}`;
    const status = await deleteFile(filePath);
    if(status) {
      Alert.alert(
        'File deleted successfully.'
      )
      setFiles(prev => prev.filter(f => f.id !== fileId))
    }
  }

  async function handleShare() {
    setMenuVisible(false)
    const filePath = `public/${userId}/${folderId}/${name}`;
    const shareLink = await shareFile(filePath);
    if(!shareLink) {
      Alert.alert('An error occured on sharing the file.');
      return
    }
    Alert.alert(
      'Copy This Link To Share Your Uploaded Files With Others',
      shareLink
    )
  }

  async function handleRename() {
    setMenuVisible(false)
    setModalVisible(true)
  }
  
  return (
    <Popover
    isVisible={menuVisible}
    from={point}
    placement={Placement.BOTTOM}
    onRequestClose={() => setMenuVisible(false)}
    >
      <View style={styles.modalContent}>
        <Pressable
        style={styles.modalButton}
        onPress={handleDelete}
        >
          <Text style={[styles.modalButtonText, styles.deleteText]}>Delete</Text>
        </Pressable>
        <Pressable
        style={styles.modalButton}
        onPress={handleShare}
        >
          <Text style={styles.modalButtonText}>Share</Text>
        </Pressable>
        <Pressable
        style={styles.modalButton}
        onPress={handleRename}
        >
          <Text style={styles.modalButtonText}>Rename</Text>
        </Pressable>
      </View>
    </Popover>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    borderWidth: 1,
    backgroundColor: 'white',
    minWidth: 160,
    elevation: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },

  modalButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },

  deleteText: {
    color: '#DC2626',
  },
})