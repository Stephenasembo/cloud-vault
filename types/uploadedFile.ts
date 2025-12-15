export type UploadedFile = {
  name: string;
  id: string;
  metadata: MetaData;
}

export type MetaData = {
  mimetype: string,
  size: number;
}