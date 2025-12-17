import { decode } from 'base64-arraybuffer'
import { supabase } from '../lib/supabase'
import { pickFile, readFileAsBase64 } from '../utils/filePicker'
import { FileObject } from '@supabase/storage-js'
import { createFileMetadata } from './file'

export type uploadDetailsType = {
  id: string;
  path: string;
  fullPath: string;
}

export async function uploadFile(userId: string, folderId: string): Promise<null | uploadDetailsType> {
  const file = await pickFile()
  if(!file) return null;
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
    return null;
  };
  console.log('Uploaded file data:', data)
  const fileData = await createFileMetadata(data.id, userId, file.name, filePath);
  if(!fileData) {
    console.log("Error creating file metadata", fileData);
    return null
  }
  return data;
}

export async function readFolderUploads(userId: string, folderId: string): Promise<FileObject[] | []> {
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
    return []
  }
  console.log('Folder files:', data)
  return data;

}

export async function deleteFile(filePath: string) {
  const { data, error } = await supabase
  .storage
  .from('cloudvault_userfiles')
  .remove([`${filePath}`])

  if(error) {
    console.log(error);
    return false;
  }
  console.log("File deleted:", data);
  return true
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