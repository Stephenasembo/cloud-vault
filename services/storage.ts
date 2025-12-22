import { decode } from 'base64-arraybuffer'
import { supabase } from '../lib/supabase'
import { pickFile, readFileAsBase64 } from '../utils/filePicker'
import { FileObject } from '@supabase/storage-js'
import { createFileMetadata, deleteFileMetadata } from './file'
import { ErrorType, FilePickSuccess } from '../utils/filePicker'

export type UploadSuccessType = {
  error: false
  id: string;
  path: string;
  fullPath: string;
}

export type FileFetchSuccessType = {
  error: false;
  files: FileObject[];
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
  return {
    error: false,
    id: data.id,
    path: data.path,
    fullPath: data.fullPath,
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
  console.log('Folder files:', data)
  return {
    error: false,
    files: data,
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