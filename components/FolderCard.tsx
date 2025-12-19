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
}

export default function FolderCard ({ folderName, folderId, openMenu }: FolderCardProps) {  
  const menuRef = useRef<View | null>(null);

  return (
    <View>
      <Pressable
      style={styles.card}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text>{folderName}</Text>
          <View
          ref={menuRef}
          collapsable={false}
          >
            <Pressable
            onPress={() => {
              menuRef.current?.measureInWindow((x, y, width, height) => {
                openMenu({
                  name: folderName,
                  id: folderId,
                  coordinates: {
                    x: x + width / 2,
                    y: y + height,
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
    marginBottom: 16,
    width: '100%',
  },
  button : {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
  }
})