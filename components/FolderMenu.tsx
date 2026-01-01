import { View, Text, StyleSheet, Alert, Pressable, Share } from "react-native";
import { Dispatch, SetStateAction, useMemo } from "react";
import Popover from "react-native-popover-view";
import { FileObject } from '@supabase/storage-js';
import { deleteFile, shareFile } from "../services/storage";
import { Placement, Point } from 'react-native-popover-view/dist/Types'
import { useRouter } from "expo-router";
import { ColorTheme, useThemeContext } from "../context/ThemeContext";

export type FolderMenuType = {
  folderId: string;
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  setEditModalVisible: Dispatch<SetStateAction<boolean>>;
  coordinates: { x: number, y: number};
  setDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function FolderMenu({
  folderId,
  menuVisible,
  setMenuVisible,
  setEditModalVisible,
  coordinates,
  setDeleteModalVisible,
}: FolderMenuType) {

  const router = useRouter();
  const { colors } = useThemeContext();

  const point = useMemo(() => new Point(coordinates.x, coordinates.y),
  [coordinates.x, coordinates.y]);
  const styles = useMemo(() => createThemedStyles(colors), [colors])

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
        onPress={() => {
          setMenuVisible(false)
          setEditModalVisible(true)
        }}
        >
          <Text style={styles.modalButtonText}>Rename</Text>
        </Pressable>
        <Pressable
        style={styles.modalButton}
        onPress={() => {
          setMenuVisible(false)
          setDeleteModalVisible(true)
        }}
        >
          <Text style={[styles.modalButtonText, styles.deleteText]}>Delete</Text>
        </Pressable>
      </View>
    </Popover>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      minWidth: 160,
      elevation: 8,
      paddingVertical: 12,
      borderRadius: 14,

      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 6 },
    },

    modalButton: {
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      fontSize: 16,
      margin: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },

    modalButtonText: {
      fontSize: 14,
      color: colors.primary,
    },

    deleteText: {
      color: '#DC2626',
      fontWeight: '500',
    },
  })
)