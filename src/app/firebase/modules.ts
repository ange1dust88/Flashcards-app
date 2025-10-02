import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
  const moduleData: Module = {
    id: moduleId,
    title,
    description,
    imageUrl,
    wordList,
    author,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "modules", moduleId), moduleData);

  console.log("✅ Module created in Firestore:", moduleId);
}
