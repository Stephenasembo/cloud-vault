import { PropsWithChildren, useEffect, useState } from "react";
import { Folder } from "../types/folder";
import { getFolders, updateFolder } from "../services/folder";
import { useAuthContext } from "../context/AuthContext";
import {FoldersContext} from "../context/FoldersContext";
import { createFolder, deleteFolder } from "../services/folder";
import { FetchingStatusType } from "../types/fetchingStatus";
import { ErrorType } from "../types/errorType";

export type SuccessType = {
  error: false;
  message: string;
}


export default function FoldersProvider({children} : PropsWithChildren) {
  const { userId } = useAuthContext()
  const [userFolders, setUserFolders] = useState<Folder[] | []>([]);
  const [folderFetchingStatus, setFolderFetchingStatus] = useState<FetchingStatusType>('idle');

  async function refreshFolders(): Promise<void> {
    if (!userId) return;
    setFolderFetchingStatus('loading')
    try {
      const data = await getFolders(userId);
      if(data) {
        setFolderFetchingStatus('success');
        setUserFolders(data);
      }
    } catch (err) {
      setFolderFetchingStatus('error')
      console.log("Failed to fetch folders:", err);
    }
  }

  async function addFolder(folderName: string): Promise<SuccessType | ErrorType> {
    if(!userId) return {
      error: true,
      messageTitle: 'Failed to add folder'
    };
    try {
      const data = await createFolder(folderName, userId);
      if(!data) {
        throw new Error("Folder was not created");
      }
      setUserFolders(prev => [...prev, data]);
      refreshFolders();
      return {
        error: false,
        message: 'Folder was created successfully'

      }
    } catch(err) {
      console.log("Failed to add folder:", err);
      return {
        error: true,
        messageTitle: "Failed to add folder"
      }
    }
  }

  async function deleteUserFolder(folderId: string): Promise<SuccessType | ErrorType> {
    const status = await deleteFolder(folderId);
    if(!status) {
      return {
        error: true,
        messageTitle: "Failed to delete folder",
      }
    }
    await refreshFolders();
    return {
      error: false,
      message: "Folder deleted successfully",
    }
  }

  async function editUserFolder(newName: string, folderId: string): Promise<SuccessType | ErrorType> {
    const data = await updateFolder(newName, folderId)
    if(!data) {
      return {
        error: true,
        messageTitle: "Failed to update folder name",
      }
    }
    await refreshFolders()
    return {
      error: false,
      message: "Folder name updated successfully",
    }
  }

  console.log("Fetsched folders:", userFolders)
  useEffect(() => {
    refreshFolders()
  }, [userId])

  return (
    <FoldersContext value={{ userFolders, refreshFolders, addFolder, deleteUserFolder, editUserFolder, folderFetchingStatus }}>
      {children}
    </FoldersContext>
  )
}