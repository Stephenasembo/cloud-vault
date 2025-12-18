import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy"

const MAX_SIZE = 5 * 1024 * 1024;

export type ErrorType = {
  error: true;
  messageTitle: string;
  message?: string;
}

export type FilePickSuccess = {
  error: false;
  uri: string;
  name: string;
  mimeType: string;
  size: number | null;
}

export async function pickFile(): Promise<ErrorType | FilePickSuccess> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  })
  if(result.canceled) return {
    error: true,
    messageTitle: "File picking canceled",
    message: "Please try again picking the file"
  };

  const file = result.assets[0];

  if(file.size && file.size > MAX_SIZE) {
    return {
      error: true,
      messageTitle: "File too large",
      message: "Please upload files smaller than 5MB"
    }
  }

  return {
    error: false,
    uri: file.uri,
    name: file.name,
    mimeType: file.mimeType ?? "application/octet-stream",
    size: file.size ?? null
  }
}

export async function readFileAsBase64(uri: string) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64'
  });
}