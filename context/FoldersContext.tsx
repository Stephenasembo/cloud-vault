import { useContext, createContext } from "react";
import { Folder } from "../types/folder";

export type FoldersType = {
  userFolders: Folder[];
  refreshFolders: () => Promise<void>;
  addFolder: (folderName: string) => Promise<void>;
  deleteUserFolder: (folderId: string) => Promise<string>;
  editUserFolder: (newName: string, folderId: string) => Promise<string>;
  folderFetchingStatus: 'idle' | 'loading' | 'success' | 'error'
}

export const FoldersContext = createContext<FoldersType>({
  userFolders: [],
  refreshFolders: async () => {},
  addFolder: async (name: string) => {},
  deleteUserFolder: async (folderId: string) => '',
  editUserFolder: async (newName: string, folderId: string) => '',
  folderFetchingStatus: 'idle'
})

export const useFoldersContext = () => useContext<FoldersType>(FoldersContext);