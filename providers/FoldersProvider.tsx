import { PropsWithChildren, useEffect, useState } from "react";
import { Folder } from "../types/folder";
import { getFolders, updateFolder } from "../services/folder";
import { useAuthContext } from "../context/AuthContext";
import {FoldersContext} from "../context/FoldersContext";
import { createFolder, deleteFolder } from "../services/folder";
import { FetchingStatusType } from "../types/fetchingStatus";
import { ErrorType } from "../types/errorType";
import { cacheFolder, readAllFoldersCache, removeFolderCache, syncFoldersCache } from "../storage/folder";
import { useDeviceContext } from "../context/DeviceContext";
import { FolderMutation } from "../storage/types";
import { dequeueMutation, enqueueMutation, readMutationQueue } from "../storage/folderQueue";

export type SuccessType = {
  error: false;
  message: string;
}


export default function FoldersProvider({children} : PropsWithChildren) {
  const { userId } = useAuthContext()
  const [userFolders, setUserFolders] = useState<Folder[]>([]);
  const [folderFetchingStatus, setFolderFetchingStatus] = useState<FetchingStatusType>('idle');
  const { networkStatus } = useDeviceContext();

  async function refreshFolders(): Promise<void> {
    // Read from cache
    const cachedFolders = await readAllFoldersCache();
    if(cachedFolders.length > 0) {
      setUserFolders(cachedFolders);
      setFolderFetchingStatus('success');
    }

    // Read from backend
    if(networkStatus === 'online') {
      if (!userId) return;
      setFolderFetchingStatus('loading')
      try {
        const data = await getFolders(userId);
        if(data) {
          setFolderFetchingStatus('success');
          setUserFolders(data);
          await syncFoldersCache(data);
        }
      } catch (err) {
        setFolderFetchingStatus('error')
        console.log("Failed to fetch folders:", err);
      }
    }
  }

  async function addFolder(folderName: string): Promise<SuccessType | ErrorType> {
    if(!userId) return {
      error: true,
      messageTitle: 'Failed to add folder'
    };
    try {
      if(networkStatus === 'offline') {
        const tempId = `temp-${Date.now()}`;

        const localFolder: Folder = {
          id: tempId,
          created_at: Date.now().toString(),
          name: folderName,
          user_id: userId,
        }

        const mutation: FolderMutation = {
          id: tempId,
          type: 'ADD_FOLDER',
          tempId: localFolder.created_at,
          payload: {name: folderName},
        }

        await enqueueMutation(mutation);
        setUserFolders(prev => [...prev, localFolder]);
        await cacheFolder(localFolder.id, localFolder);

        return {
          error: false,
          message: 'Folder queued for addition.'
        }
      }

      const data = await createFolder(folderName, userId);
      if(!data) {
        throw new Error("Folder was not created");
      }


      // Update cache
      await cacheFolder(data.id, data);

      setUserFolders(prev => [...prev, data]);
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

    if(networkStatus === 'offline') {
      const mutation: FolderMutation = {
        id: Date.now().toString(),
        type: 'DELETE_FOLDER',
        folderId,
      }

      setUserFolders(prev => prev.filter((folder) => folder.id !== folderId));

      await enqueueMutation(mutation);
      await removeFolderCache(folderId);

      return {
        error: false,
        message: 'Folder delete action queued.'
      }
    }

    const status = await deleteFolder(folderId);
    if(!status) {
      return {
        error: true,
        messageTitle: "Failed to delete folder",
      }
    }
    await removeFolderCache(folderId);
    setUserFolders(prev => prev.filter((folder) => folder.id !== folderId));
    return {
      error: false,
      message: "Folder deleted successfully",
    }
  }

  async function editUserFolder(newName: string, folderId: string): Promise<SuccessType | ErrorType> {

    if(networkStatus === 'offline') {
      const tempId = `temp-${Date.now()}`;

      const localFolder: Folder = {
        id: folderId,
        name: newName,
        created_at: Date.now().toString(),
        user_id: userId?? '',
      }

      const mutation: FolderMutation = {
        id: tempId,
        type: 'UPDATE_FOLDER',
        folderId,
        payload: { name: newName },
      }

      setUserFolders(prev => (
        prev.map((folder) => folder.id === folderId ? localFolder : folder)
      ))

      await enqueueMutation(mutation);
      await cacheFolder(folderId, localFolder);

      return {
        error: false,
        message: 'Folder update action queued.'
      }
    }

    const data = await updateFolder(newName, folderId)
    if(!data) {
      return {
        error: true,
        messageTitle: "Failed to update folder name",
      }
    }

    await cacheFolder(folderId, data);
    setUserFolders(prev => (
      prev.map((folder) => folder.id === folderId ? data : folder)
    ))
    return {
      error: false,
      message: "Folder name updated successfully",
    }
  }

  async function processFolderQueue() {
  const queue = await readMutationQueue();
  if(queue.length === 0) return;

  for (const mutation of queue) {
    try {
      switch (mutation.type) {
        case 'ADD_FOLDER': {
          const createdFolder = await createFolder(mutation.payload.name, userId);

          if(!createdFolder) throw new Error();

          await dequeueMutation(mutation);
          await removeFolderCache(mutation.tempId);
          await cacheFolder(createdFolder.id, createdFolder);

          break;
        }

        case 'UPDATE_FOLDER': {
          const updatedFolder = await updateFolder(mutation.payload.name, mutation.folderId);

          if(!updatedFolder) throw new Error();

          await dequeueMutation(mutation);
          await cacheFolder(updatedFolder.id, updatedFolder);

          break;
        }

        case 'DELETE_FOLDER': {
          const deleteStatus = await deleteFolder(mutation.folderId);

          if(!deleteStatus) throw new Error();

          await dequeueMutation(mutation);

          break;
        }
      }
    } catch (e) {
      console.log(e);
      return
    }
  }
}

  console.log("Fetched folders:", userFolders)
  useEffect(() => {
    async function refreshAppFolders() {
      await processFolderQueue();
      await refreshFolders();
    }
    refreshAppFolders();
  }, [userId])

  return (
    <FoldersContext value={{ userFolders, refreshFolders, addFolder, deleteUserFolder, editUserFolder, folderFetchingStatus }}>
      {children}
    </FoldersContext>
  )
}