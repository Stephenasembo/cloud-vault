import { useContext, createContext } from "react";
import { Folder } from "../types/folder";

export type FoldersType = {
  userFolders: Folder[]
}

export const FoldersContext = createContext<FoldersType>({
  userFolders: [],
})

export const useFoldersContext = () => useContext<FoldersType>(FoldersContext);