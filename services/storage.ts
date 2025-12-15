import { decode } from 'base64-arraybuffer'
import { supabase } from '../lib/supabase'
import { pickFile, readFileAsBase64 } from '../utils/filePicker'
import { FileObject } from '@supabase/storage-js'

export async function uploadFile(userId: string, folderId: string): Promise<string> {
  const file = await pickFile()
  if(!file) return 'Error on uploading file.'
  const base64String = await readFileAsBase64(file.uri);

  const filePath = `public/${userId}/${folderId}/${Date.now()}-${file.name}`

  const { data, error } = await supabase
    .storage
    .from('cloudvault_userfiles')
    .upload(filePath, decode(base64String), {
      contentType: file.mimeType
    })
  
  if(error){
    console.log(error)
    return 'Error on uploading file.'
  };
  console.log('Uploaded file data:', data)
  return 'File uploaded successfully.'
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