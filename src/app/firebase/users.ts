import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
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

export async function getUserByUid(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      console.log("No user found with UID:", uid);
      return null;
    }

    const userData = snapshot.data() as User;
    return userData;
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    return null;
  }
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

    const userData = snapshot.docs[0].data() as User;
    return userData;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function updateUserPhoto(
  uid: string,
  newPhotoURL: string
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      photoURL: newPhotoURL,
    });
    console.log("User photo updated:", uid);
  } catch (error) {
    console.error("Error updating user photo:", error);
  }
}

export async function updateUserBanner(
  uid: string,
  newBannerURL: string
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      bannerURL: newBannerURL,
    });
    console.log("User banner updated:", uid);
  } catch (error) {
    console.error("Error updating user banner:", error);
  }
}
