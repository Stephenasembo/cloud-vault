import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { formatFileSize, formatDate } from '../utils/fileDetailsFormat'
import { useState, useRef } from 'react'
import Popover from 'react-native-popover-view'
import { Placement } from 'react-native-popover-view/dist/Types'
import { useAuthContext } from '../context/AuthContext'
import { deleteFile } from '../services/storage'

type FileCardProps = {
  name: string
  size: number
  uploadedAt: string
  folderId: string
}

export default function FileCard({
  name,
  size,
  uploadedAt,
  folderId,
}: FileCardProps) {

  const { userId } = useAuthContext();
  const [menuVisible, setMenuVisible] = useState(false);

  async function handleDelete() {
    const filePath = `public/${userId}/${folderId}/${name}`;
    const status = await deleteFile(filePath);
    if(status) {
      Alert.alert(
        'File deleted successfully.'
      )
    }
  }

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

          <Popover
          isVisible={menuVisible}
          from={(
            <Pressable
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
            >
              <Text style={styles.menuButtonText}>Menu</Text>
            </Pressable>
          )}
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
              >
                <Text style={styles.modalButtonText}>Share</Text>
              </Pressable>
            </View>
          </Popover>

        </View>
        <View style={styles.metaDataContainer}>
          <Text style={styles.metaText}>
            {formatFileSize(size)} • {formatDate(uploadedAt)}
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
    borderRadius: 16,
    flexShrink: 0,
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
