import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy"

export async function pickFile() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  })
  if(result.canceled) return null;

  const file = result.assets[0];

  return {
    uri: file.uri,
    name: file.name,
    mimeType: file.mimeType ?? "application/octet-stream",
    size: file.size
  }
}

export async function readFileAsBase64(uri: string) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64'
  });
}