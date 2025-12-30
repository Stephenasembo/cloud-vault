import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";
import { FolderMutation } from "./types";

export async function readMutationQueue(): Promise<FolderMutation[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.FOLDER_MUTATION_QUEUE);
  if(!data) return [];
  return JSON.parse(data);
}

export async function enqueueMutation(mutation: FolderMutation) {
  const queue = await readMutationQueue();
  queue.push(mutation);
  await AsyncStorage.setItem(STORAGE_KEYS.FOLDER_MUTATION_QUEUE, JSON.stringify(queue));
}

export async function dequeueMutation(mutation: FolderMutation) {
  const queue = await readMutationQueue();
  if(queue.length === 0) return;
  const newQueue = queue.filter((item: FolderMutation) => item.id !== mutation.id)
  await AsyncStorage.setItem(STORAGE_KEYS.FOLDER_MUTATION_QUEUE, JSON.stringify(newQueue));
}