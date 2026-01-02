import { View, Text, StyleSheet, Alert, Pressable, Share } from "react-native";
import { Dispatch, SetStateAction, useMemo } from "react";
import Popover from "react-native-popover-view";
import { FileObject } from '@supabase/storage-js';
import { deleteFile, shareFile } from "../services/storage";
import { Placement, Point } from 'react-native-popover-view/dist/Types'
import { ColorTheme, useThemeContext } from "../context/ThemeContext";
import { useDeviceContext } from "../context/DeviceContext";

export type MenuType = {
  userId: string;
  folderId: string;
  name: string;
  fileId: string;
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  coordinates: { x: number, y: number};
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
  storagePath: string;
}

export default function MenuPopover({
  userId,
  folderId,
  name,
  fileId,
  menuVisible,
  setMenuVisible,
  coordinates,
  setModalVisible,
  setDeleteModalVisible,
  storagePath,
}: MenuType) {

  const { colors } = useThemeContext();
  const { networkStatus } = useDeviceContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  const point = useMemo(() => new Point(coordinates.x, coordinates.y),
  [coordinates.x, coordinates.y]);

  async function handleShare() {
    setMenuVisible(false);
    if(networkStatus === 'offline') {
      Alert.alert(
        'Failed to create share link',
        'Please connect to the internet and try again'
      )
      return
    }
    const shareLink = await shareFile(storagePath);
    if(!shareLink) {
      Alert.alert('Failed to create share link.');
      return
    }
    await Share.share({
      message: `Here is a file I shared with you: \n${shareLink}`
    });
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
    popoverStyle={styles.popover}
    >
      <View>
        <Pressable
        style={styles.modalButton}
        onPress={() => {
          setMenuVisible(false)
          setDeleteModalVisible(true)
        }}
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

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    popover: {
      backgroundColor: colors.background,
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
      justifyContent: 'center',
      borderColor: colors.menuBorder,
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