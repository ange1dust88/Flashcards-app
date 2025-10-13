import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No user found with username:", username);
      return null;
    }

    // Предположим, username уникален → берем первый документ
    const userData = snapshot.docs[0].data() as User;
    return userData;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}
