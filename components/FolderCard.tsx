import { Pressable, View, Text, StyleSheet, Alert } from "react-native"
import { useFoldersContext } from "../context/FoldersContext";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import InputModal from "./InputModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Toast from 'react-native-toast-message';
import { EllipsisVertical } from "lucide-react-native";

export type PickedFolder = {
  id: string;
  name: string;
  coordinates: {x: number, y: number};
}

export type FolderCardProps = {
  folderName: string;
  folderId: string;
  openMenu: (folder: PickedFolder) => void;
  handleOpen: () => void;
}

export default function FolderCard ({ folderName, folderId, openMenu, handleOpen }: FolderCardProps) {  
  const menuRef = useRef<View | null>(null);

  return (
    <View>
      <Pressable
      style={styles.card}
      onPress={handleOpen}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.cardText}>{folderName}</Text>
          <View
          ref={menuRef}
          collapsable={false}
          >
            <Pressable
            style={styles.menuButton}
            onPress={() => {
              menuRef.current?.measureInWindow((x, y, width, height) => {
                openMenu({
                  name: folderName,
                  id: folderId,
                  coordinates: {
                    x: x + width / 2,
                    y: y + height + 24,
                  }
                })
              })
            }}
            >
              <EllipsisVertical />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },

  cardText: {
    fontSize: 18,
  },

  menuButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  }
})