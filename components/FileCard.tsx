import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { formatFileSize, formatDate } from '../utils/fileDetailsFormat'

type FileCardProps = {
  name: string
  size: number
  uploadedAt: string
}

export default function FileCard({
  name,
  size,
  uploadedAt,
}: FileCardProps) {
  function handleMenuPress() {
    Alert.alert(
      'Card menu coming soon.'
    )
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
          <Pressable
          style={styles.menuButton}
          onPress={handleMenuPress}
          >
            <Text style={styles.menuButtonText}>Menu</Text>
          </Pressable>
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

})
