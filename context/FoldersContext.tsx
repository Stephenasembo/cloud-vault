import { useContext, createContext } from "react";
import { Folder } from "../types/folder";

export type FoldersType = {
  userFolders: Folder[];
  refreshFolders: () => Promise<void>;
  addFolder: (folderName: string) => Promise<void>;
  deleteUserFolder: (folderId: string) => Promise<string>;
}

export const FoldersContext = createContext<FoldersType>({
  userFolders: [],
  refreshFolders: async () => {},
  addFolder: async (name: string) => {},
  deleteUserFolder: async (folderId: string) => '',
})

export const useFoldersContext = () => useContext<FoldersType>(FoldersContext);