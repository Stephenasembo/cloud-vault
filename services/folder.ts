import { supabase } from "../lib/supabase"
import { Folder } from "../types/folder"

export async function createFolder(folderName: string, userId: string | null): Promise<Folder | null> {
  const { data, error } = await supabase
    .from('Folders')
    .insert([
      { name: folderName, user_id: userId }
    ])
    .select()
    .single()
  if (error) {
    console.log("Insert error:", error);
    return null;
  } else {
    console.log("Inserted:", data);
    return data;
  }
}

export async function getFolders(userId: string | null): Promise<Folder[] | []> {
  const { data, error } = await supabase
    .from('Folders')
    .select('*')
    .eq('user_id', userId)
    if (error) {
      console.log("Error getting user folders", error);
      return [];
    } else {
      console.log("Successfully got user folders", data);
      return data;
    }
}

export async function getFolder(folderId: string): Promise<Folder | null> {
  const { data, error} = await supabase
    .from('Folders')
    .select('*')
    .eq('id', folderId)
    .single()
    if (error) {
      console.log("Error getting user folder", error);
      return null;
    } else {
      console.log("Successfully got user folder", data);
      return data;
    }
}

export async function updateFolder(newName: string, folderId: string): Promise<Folder | null> {
  const { data, error} = await supabase
    .from('Folders')
    .update({ name: newName })
    .eq('id', folderId)
    .select()
    .single()
    if (error) {
      console.log("Error updating user folder", error);
      return null;
    } else {
      console.log("Successfully updated user folder", data);
      return data;
    }
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('Folders')
    .delete()
    .eq('id', folderId)
    if (error) {
      console.log("Error updating user folder", error);
      return false;
    }
    return true;
}