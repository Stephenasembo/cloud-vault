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

export { Folder, User, File, SuccessStorageType }