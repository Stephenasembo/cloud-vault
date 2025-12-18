import { supabase } from "../lib/supabase";

export async function getFileDisplayName(fileId: string): Promise<string | null> {
  const { data, error } = await supabase
  .from('Files')
  .select('display_name')
  .eq('id', fileId)
  .single()
  if(error) {
    console.log("Could not get file display name", error)
    return null;
  }
  console.log("Successfully got file display name", data)
  return data.display_name
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

export async function updateDisplayName(newName: string, fileId: string) {
  const { data, error } = await supabase
  .from('Files')
  .update({ display_name: newName })
  .eq('id', fileId)
  .select()
  .single()

  if(error) {
    console.log("An error occured while updating the file name", error)
    return null;
  }
  console.log("Successfully updated the file name", data);
  return data;
}