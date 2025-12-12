import { PropsWithChildren, useEffect, useState } from "react";
import { Folder } from "../types/folder";
import { getFolders } from "../services/folder";
import { useAuthContext } from "../context/AuthContext";
import {FoldersContext} from "../context/FoldersContext";


export default function FoldersProvider({children} : PropsWithChildren) {
  const { userId } = useAuthContext()
  const [userFolders, setUserFolders] = useState<Folder[] | []>([]);

  console.log("Fetsched folders:", userFolders)
  useEffect(() => {
    if (!userId) return;
    getFolders(userId)
      .then((data) => setUserFolders(data))
      .catch((err: unknown) => console.log("An error occured", err))
  }, [userId])

  return (
    <FoldersContext value={{userFolders: userFolders}}>
      {children}
    </FoldersContext>
  )
}