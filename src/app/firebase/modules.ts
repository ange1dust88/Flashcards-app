import { doc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { db } from "./config";
import { User } from "./users";

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
  author: User;
  createdAt: any;
  updatedAt: any;
}

export async function createModule(
  moduleId: string,
  title: string,
  description: string,
  wordList: WordItem[],
  author: User,
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
    author,
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

    const modules: Module[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl ?? "",
        wordList: data.wordList ?? [],
        author: data.author,
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


