import { PropsWithChildren, useEffect, useState } from "react";
import { Folder } from "../types/folder";
import { getFolders } from "../services/folder";
import { useAuthContext } from "../context/AuthContext";
import {FoldersContext} from "../context/FoldersContext";
import { createFolder, deleteFolder } from "../services/folder";


export default function FoldersProvider({children} : PropsWithChildren) {
  const { userId } = useAuthContext()
  const [userFolders, setUserFolders] = useState<Folder[] | []>([]);

  async function refreshFolders(): Promise<void> {
    if (!userId) return;
    try {
      const data = await getFolders(userId);
      setUserFolders(data);
    } catch (err) {
      console.log("Failed to fetch folders:", err);
    }
  }

  async function addFolder(folderName: string): Promise<void> {
    if(!userId) return;
    try {
      const data = await createFolder(folderName, userId);
      if(!data) {
        throw new Error("Folder was not created");
      }
      setUserFolders(prev => [...prev, data]);
      refreshFolders();
    } catch(err) {
      console.log("Failed to add folder:", err);
    }
  }

  async function deleteUserFolder(folderId: string): Promise<string> {
    const status = await deleteFolder(folderId);
    if(!status) {
      return "Failed to delete folder"
    }
    await refreshFolders();
    return "Folder deleted successfully"
  }

  console.log("Fetsched folders:", userFolders)
  useEffect(() => {
    refreshFolders()
  }, [userId])

  return (
    <FoldersContext value={{ userFolders, refreshFolders, addFolder, deleteUserFolder }}>
      {children}
    </FoldersContext>
  )
}