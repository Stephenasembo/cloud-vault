import { Pressable, View, Text, StyleSheet, Alert } from "react-native"
import { useFoldersContext } from "../context/FoldersContext";
import { Dispatch, SetStateAction, useRef, useState, useMemo } from "react";
import InputModal from "./InputModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Toast from 'react-native-toast-message';
import { EllipsisVertical } from "lucide-react-native";
import { ColorTheme, useThemeContext } from "../context/ThemeContext";

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
  const { colors } = useThemeContext();
  
  const styles = useMemo(() => createThemedStyles(colors), [colors]);

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
              <EllipsisVertical color='#6B7280'/>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    card: {
      borderRadius: 14,
      padding: 18,
      marginBottom: 16,
      backgroundColor: 'white',
      borderColor: colors.border,

      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },

      elevation: 6,
    },

    cardText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },

    menuButton: {
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    }
  })
)