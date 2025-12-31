import { supabase } from "../lib/supabase";
import { ErrorType } from "../types/errorType";

export type FileSuccessType = {
  error: false;
  message: string;
  data: FileMetadata;
}

type FileMetadata = {
  id: string;
  created_at: string;
  storage_path: string;
  display_name: string;
  user_id: string;
}

export async function getFileMetadata(fileId: string): Promise<FileMetadata | null> {
  const { data, error } = await supabase
  .from('Files')
  .select()
  .eq('id', fileId)
  .single()
  if(error) {
    console.log("Could not get file display name", error)
    return null;
  }
  console.log("Successfully got file display name", data)
  return data
}

export async function createFileMetadata(fileId: string, userId: string, fileName: string, filePath: string) {
  const { data, error } = await supabase
  .from('Files')
  .insert([
    {id: fileId, user_id: userId, display_name: fileName, storage_path: filePath}
  ])
  .select()
  .single()
  if(error) {
    console.log("Error on creating uploaded file metadata", error);
    return null;
  }
  console.log("Successfully added file metadata", data);
  return data;
}

export async function updateDisplayName(newName: string, fileId: string): Promise<FileSuccessType | ErrorType> {
  const { data, error } = await supabase
  .from('Files')
  .update({ display_name: newName })
  .eq('id', fileId)
  .select()
  .single()

  if(error) {
    console.log("An error occured while updating the file name", error)
    return {
      error: true,
      messageTitle: 'An error occured while updating the file name',
    };
  }
  console.log("Successfully updated the file name", data);
  return {
    error: false,
    message: 'Successfully updated the file name',
    data: data
  };
}

export async function deleteFileMetadata(fileId: string): Promise<boolean> {
  const { error } = await supabase
  .from('Files')
  .delete()
  .eq('id', fileId)

  if(error) {
    console.log("Error occured on deleting file", error)
    return false;
  }
  return true;
}