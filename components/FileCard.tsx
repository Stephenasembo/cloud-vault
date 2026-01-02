import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { formatFileSize, formatDate } from '../utils/fileDetailsFormat'
import { SetStateAction, Dispatch, useRef, useEffect, useState, useMemo } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { FileObject } from '@supabase/storage-js';
import { PickedFileType } from '../types/pickedFile';
import { categorizeFile } from '../utils/categorizeFile';
import { EllipsisVertical } from 'lucide-react-native';
import { useThemeContext, ColorTheme } from '../context/ThemeContext';

type FileCardProps = {
  name: string
  size: string
  uploadedAt: string
  folderId: string
  id: string
  openMenu: (chosenFile: PickedFileType) => void;
  fileType: string;
  storagePath: string;
}

export default function FileCard({
  name,
  size,
  uploadedAt,
  id,
  openMenu,
  fileType,
  storagePath,
}: FileCardProps) {

  const { userId } = useAuthContext();
  const menuRef = useRef<View | null>(null);
  const { colors }= useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <View style={{flex: 1, marginRight: 8}}>
            <Text
            style={styles.fileName}
            numberOfLines={1} ellipsizeMode="tail"
            >
              {name}
            </Text>
          </View>
          <View
          >
            <View
            ref={menuRef}
            collapsable={false}
            >
              <Pressable
              style={styles.menuButton}
              onPress={() => {
                menuRef.current?.measureInWindow((x, y, width, height) => {
                openMenu({
                name: name,
                fileId: id,
                storagePath: storagePath,
                coordinates: {
                  x: x + width / 2,
                  y: y + height + 12,
                },
              })})}}>
                <EllipsisVertical />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.metaDataContainer}>
          <Text style={styles.metaText}>
            {fileType} • {size} • {uploadedAt}
          </Text>
        </View>
      </View>
    </View>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    card: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      marginBottom: 12,

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,

      elevation: 3,
    },

    infoContainer: {
      flex: 1,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    fileName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },

    metaDataContainer: {
      alignItems: 'flex-end',
      marginRight: 8,
    },

    metaText: {
      fontSize: 12,
      color: '#6B7280',
    },

    menuButton: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      flexShrink: 0,
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'center',
    },

    menuButtonText: {
      fontSize: 12,
      color: '#6B7280',
    },

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
)