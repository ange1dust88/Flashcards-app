import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

interface WordItem {
  term: string;
  definition: string;
  imageUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  wordList: WordItem[];
  authorUsername: string | null | undefined;
  authorUid: string;
  createdAt: any;
  updatedAt: any;
}

export async function createModule(
  moduleId: string,
  title: string,
  description: string,
  wordList: WordItem[],
  authorUsername: string,
  authorUid: string,
  imageUrl?: string
): Promise<void> {
  const cleanedWordList = wordList.map((word) => ({
    ...word,
    imageUrl: word.imageUrl ?? "",
  }));

  const moduleData: Module = {
    id: moduleId,
    title,
    description,
    imageUrl: imageUrl ?? "",
    wordList: cleanedWordList,
    authorUsername,
    authorUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "modules", moduleId), moduleData);

  console.log("Module created in Firestore:", moduleId);
}

export async function getAllModules(): Promise<Module[]> {
  try {
    const modulesCollection = collection(db, "modules");
    const snapshot = await getDocs(modulesCollection);

    const modules: Module[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl ?? "",
        wordList: data.wordList ?? [],
        authorUsername: data.authorUsername,
        authorUid: data.authorUid,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Module;
    });

    return modules;
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

export async function getModuleById(moduleId: string): Promise<Module | null> {
  try {
    const moduleRef = doc(db, "modules", moduleId);
    const moduleSnap = await getDoc(moduleRef);

    if (!moduleSnap.exists()) {
      console.warn(`Module with id "${moduleId}" not found`);
      return null;
    }

    const data = moduleSnap.data();

    const moduleData: Module = {
      id: moduleSnap.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl ?? "",
      wordList: data.wordList ?? [],
      authorUsername: data.authorUsername,
      authorUid: data.authorUid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return moduleData;
  } catch (error) {
    console.error("Error fetching module by id:", error);
    return null;
  }
}

export async function getModulesByUsername(
  username: string
): Promise<Module[]> {
  try {
    const modulesRef = collection(db, "modules");
    const q = query(modulesRef, where("authorUsername", "==", username));
    const snapshot = await getDocs(q);

    const modules: Module[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl ?? "",
        wordList: data.wordList ?? [],
        authorUsername: data.authorUsername,
        authorUid: data.authorUid,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Module;
    });

    return modules;
  } catch (error) {
    console.error("Error fetching modules by username:", error);
    return [];
  }
}

export async function updateModuleHeader(
  moduleId: string,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
  }
): Promise<void> {
  try {
    const moduleRef = doc(db, "modules", moduleId);

    await updateDoc(moduleRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log("Module header updated:", moduleId);
  } catch (error) {
    console.error("Error updating module header:", error);
    throw error;
  }
}

export async function updateModuleWordList(
  moduleId: string,
  wordList: WordItem[]
): Promise<void> {
  try {
    const moduleRef = doc(db, "modules", moduleId);

    await updateDoc(moduleRef, {
      wordList,
      updatedAt: serverTimestamp(),
    });

    console.log("Word list updated:", moduleId);
  } catch (error) {
    console.error("Error updating word list:", error);
    throw error;
  }
}
