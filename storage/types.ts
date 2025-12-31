type Folder = {
  id: string;
  name: string;
}

type User = {
  id: string;
}

type File = {
  id: string;
  folderId: string;
  name: string;
  storagePath: string;
  uploadedAt: string;
  size: string;
  type: string;
}

type SuccessStorageType = {
  error: false;
  message: string;
  data?: User | Folder | File | null;
}

type FolderMutation =
  {
    id: string;
    type: 'ADD_FOLDER';
    tempId: string;
    payload: { name: string };
  } |
  {
    id: string;
    type: 'UPDATE_FOLDER';
    folderId: string;
    payload: { name: string };
  } |
  {
    id: string;
    type: 'DELETE_FOLDER';
    folderId: string;
  };

type FileMutation = 
{
  id: string;
  type: 'RENAME_FILE';
  folderId: string;
  fileId: string;
  payload: { name: string };
} |
{
  id: string;
  type: 'DELETE_FILE';
  folderId: string;
  fileId: string;
  payload: {filePath: string};
}

export { Folder, User, File, SuccessStorageType, FolderMutation, FileMutation }