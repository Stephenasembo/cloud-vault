import { useContext, createContext } from "react";
import { Folder } from "../types/folder";
import { SuccessType } from "../providers/FoldersProvider";
import { ErrorType } from "../types/errorType";

export type FoldersType = {
  userFolders: Folder[];
  refreshFolders: () => Promise<void>;
  addFolder: (folderName: string) => Promise<SuccessType | ErrorType>;
  deleteUserFolder: (folderId: string) => Promise<SuccessType | ErrorType>;
  editUserFolder: (newName: string, folderId: string) => Promise<SuccessType | ErrorType>;
  folderFetchingStatus: 'idle' | 'loading' | 'success' | 'error';
  hasPendingChanges: boolean;
}

export const FoldersContext = createContext<FoldersType>({
  userFolders: [],
  refreshFolders: async () => {},
  addFolder: async (name: string) => ({error: false, message: 'success'}),
  deleteUserFolder: async (folderId: string) => ({error: false, message: 'success'}),
  editUserFolder: async (newName: string, folderId: string) => ({error: false, message: 'success'}),
  folderFetchingStatus: 'idle',
  hasPendingChanges: false,
})

export const useFoldersContext = () => useContext<FoldersType>(FoldersContext);