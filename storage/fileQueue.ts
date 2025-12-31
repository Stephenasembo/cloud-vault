import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";
import { FileMutation } from "./types";

export async function readMutationQueue(): Promise<FileMutation[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.FILE_MUTATION_QUEUE);
  if(!data) return [];
  return JSON.parse(data);
}

export async function enqueueMutation(mutation: FileMutation) {
  const queue = await readMutationQueue();
  queue.push(mutation);
  await AsyncStorage.setItem(STORAGE_KEYS.FILE_MUTATION_QUEUE, JSON.stringify(queue));
}

export async function dequeueMutation(mutation: FileMutation) {
  const queue = await readMutationQueue();
  if(queue.length === 0) return;
  const newQueue = queue.filter((item: FileMutation) => item.id !== mutation.id)
  await AsyncStorage.setItem(STORAGE_KEYS.FILE_MUTATION_QUEUE, JSON.stringify(newQueue));
}