
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";


export interface User {
  email: string;
  username: string;
  photoURL: string | null;
  bannerURL: string | null;
  createdAt: any;
}

export async function createUser(
  uid: string,
  email: string,
  username: string,
  photoURL?: string,
  bannerURL?: string
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    email,
    username,
    photoURL: photoURL || null,
    bannerURL: bannerURL || null,
    createdAt: serverTimestamp(),
  });
  console.log("User created in Firestore:", uid);
}
