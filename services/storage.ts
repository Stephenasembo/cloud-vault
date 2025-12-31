import { decode } from 'base64-arraybuffer'
import { supabase } from '../lib/supabase'
import { pickFile, readFileAsBase64 } from '../utils/filePicker'
import { FileObject } from '@supabase/storage-js'
import { createFileMetadata, deleteFileMetadata, getFileMetadata } from './file'
import { ErrorType, FilePickSuccess } from '../utils/filePicker'
import { File } from '../storage/types'
import { categorizeFile } from '../utils/categorizeFile'
import { formatDate, formatFileSize } from '../utils/fileDetailsFormat'

export type UploadSuccessType = {
  error: false
  data: File
}

export type FileFetchSuccessType = {
  error: false;
  files: File[];
}

export type DeleteSuccessType = {
  error: false;
  message: string;
}

export async function uploadFile(userId: string, folderId: string): Promise<UploadSuccessType | ErrorType> {
  const file = await pickFile();
  if(file.error) return {
    error: true,
    messageTitle: file.messageTitle,
    message: file.message,
  };

  const base64String = await readFileAsBase64(file.uri);

  const filePath = `public/${userId}/${folderId}/${Date.now()}-${file.name}`

  const { data, error } = await supabase
    .storage
    .from('cloudvault_userfiles')
    .upload(filePath, decode(base64String), {
      contentType: file.mimeType,
      upsert: false,
      metadata: { display_name: file.name }
    })
  
  if(error){
    console.log(error)
    return {
      error: true,
      messageTitle: "An internal storage error occured while uploading the file",
      message: "Please try again"
    };
  };
  console.log('Uploaded file data:', data)
  const fileData = await createFileMetadata(data.id, userId, file.name, filePath);
  if(!fileData) {
    console.log("Error creating file metadata", fileData);
    return {
      error: true,
      messageTitle: "Error while uploading file.",
      message: "Please try again",
    }
  }

  const uploadedFile = {
    id: data.id,
    storagePath: data.path,
    folderId,
    uploadedAt: formatDate(fileData.created_at),
    size: formatFileSize(file.size?? 0),
    type: categorizeFile(file.mimeType),
    name: fileData.display_name,
  }

  return {
    error: false,
    data: uploadedFile,
  }
}

export async function readFolderUploads(userId: string, folderId: string): Promise<FileFetchSuccessType | ErrorType> {
  const { data, error } = await supabase
  .storage
  .from('cloudvault_userfiles')
  .list(`public/${userId}/${folderId}`, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })

  if(error) {
    console.log(error)
    return {
      error: true,
      messageTitle: "An error occured while fetching files."
    }
  }

  const storedFiles: (File | null)[] = await Promise.all(data.map(async (file) => {
    const metadata = await getFileMetadata(file.id);
    if(!metadata) return null;

    const fileData: File = {
      id: file.id,
      name: metadata.display_name,
      storagePath: metadata.storage_path,
      folderId: folderId,
      uploadedAt: formatDate(file.updated_at),
      size: formatFileSize(file.metadata.size?? 0),
      type: categorizeFile(file.metadata.mimetype),
    }
    return fileData;
  }))

  console.log('Folder files:', data)
  return {
    error: false,
    files: storedFiles.filter((f) => f !== null),
  };
}

export async function deleteFile(filePath: string, fileId: string): Promise<DeleteSuccessType | ErrorType> {
  console.log(filePath);
  const { data, error } = await supabase
  .storage
  .from('cloudvault_userfiles')
  .remove([filePath])

  if(error) {
    console.log(error);
    return {
      error: true,
      messageTitle: 'Failed to delete file.'
    };
  }

  const response = await deleteFileMetadata(fileId)

  if(!response) {
    return {
      error: true,
      messageTitle: 'Failed to delete file.'
    }
  }

  return {
    error: false,
    message: 'File deleted successfully.'
  }
}

export async function shareFile(filePath: string): Promise<string | null> {
  const { data, error } = await supabase
  .storage
  .from('cloudvault_userfiles')
  .createSignedUrl(filePath, 300)

  if(error) {
    console.log("Error on creating share link:", error)
    return null;
  }
  console.log("File share link:", data.signedUrl)
  return data.signedUrl;
}