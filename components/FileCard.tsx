import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { formatFileSize, formatDate } from '../utils/fileDetailsFormat'
import { SetStateAction, Dispatch, useRef } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { FileObject } from '@supabase/storage-js';
import { PickedFileType } from '../types/pickedFile';
import { categorizeFile } from '../utils/categorizeFile';

type FileCardProps = {
  name: string
  size: number
  uploadedAt: string
  folderId: string
  setFiles: Dispatch<SetStateAction<FileObject[] | []>>
  id: string
  openMenu: (chosenFile: PickedFileType) => void;
  fileType: string;
}

export default function FileCard({
  name,
  size,
  uploadedAt,
  folderId,
  setFiles,
  id,
  openMenu,
  fileType,
}: FileCardProps) {

  const { userId } = useAuthContext();
  const menuRef = useRef<View | null>(null);

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
                name,
                fileId: id,
                coordinates: {
                  x: x + width / 2,
                  y: y + height + 12,
                },
              })})}}>
                <Text style={styles.menuButtonText}>Menu</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.metaDataContainer}>
          <Text style={styles.metaText}>
            {categorizeFile(fileType)} • {formatFileSize(size)} • {formatDate(uploadedAt)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 10,
    borderWidth: 1,
    width: '100%',
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
    flexShrink: 1,
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
    borderWidth: 1,
    borderRadius: 20,
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
