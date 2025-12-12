import { supabase } from "../lib/supabase"

export async function createFolder(folderName: string, userId: string | null) {
  const { data, error } = await supabase
    .from('Folders')
    .insert([
      { name: folderName, user_id: userId }
    ])
  if (error) {
    console.log("Insert error:", error);
  } else {
    console.log("Inserted:", data);
  }
}
