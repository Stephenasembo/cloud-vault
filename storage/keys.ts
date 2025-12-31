export const STORAGE_KEYS = {
  USER: '@cloudvault:user',
  FOLDERS: '@cloudvault:folders',
  FILES: '@cloudvault:files',

  FOLDER_INDEX: '@cloudvault:folders:all',
  FILE_INDEX: '@cloudvault:files:all',

  FOLDER_MUTATION_QUEUE: '@cloudvault:folder_mutations',
  FILE_MUTATION_QUEUE: '@cloudvault:file_mutations',
}

export function generateFileKey(folderId: string, fileId: string): string {
  return `${STORAGE_KEYS.FOLDERS}:${folderId}:FILES:${fileId}`
}

export function getFolderFileIndex(folderId: string): string {
  return `${STORAGE_KEYS.FOLDERS}:${folderId}:all`
}