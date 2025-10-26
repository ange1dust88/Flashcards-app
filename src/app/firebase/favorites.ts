import { db } from "./config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { Module } from "./modules";

export interface Favourite {
  userUid: string;
  moduleId: string;
  createdAt: any;
}

export async function addFavourite(
  userUid: string,
  moduleId: string
): Promise<void> {
  try {
    const favouritesRef = collection(db, "favourites");
    const q = query(
      favouritesRef,
      where("userUid", "==", userUid),
      where("moduleId", "==", moduleId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      console.log("Already in favourites:", moduleId);
      return;
    }

    await addDoc(favouritesRef, {
      userUid,
      moduleId,
      createdAt: serverTimestamp(),
    });

    console.log(`Module ${moduleId} added to favourites by ${userUid}`);
  } catch (error) {
    console.error("Error adding favourite:", error);
    throw error;
  }
}

export async function getFavouritesByUser(userUid: string): Promise<Module[]> {
  try {
    const favouritesRef = collection(db, "favourites");
    const q = query(favouritesRef, where("userUid", "==", userUid));
    const favSnapshot = await getDocs(q);

    const modules: Module[] = [];

    for (const favDoc of favSnapshot.docs) {
      const { moduleId } = favDoc.data() as { moduleId: string };
      const moduleRef = doc(db, "modules", moduleId);
      const moduleSnap = await getDoc(moduleRef);

      if (!moduleSnap.exists()) {
        console.warn(`Module with id "${moduleId}" not found`);
        continue;
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

      modules.push(moduleData);
    }

    modules.sort((a, b) => {
      const favA =
        favSnapshot.docs
          .find((d) => (d.data() as any).moduleId === a.id)
          ?.data().createdAt?.seconds || 0;
      const favB =
        favSnapshot.docs
          .find((d) => (d.data() as any).moduleId === b.id)
          ?.data().createdAt?.seconds || 0;
      return favB - favA;
    });

    return modules;
  } catch (error) {
    console.error("Error fetching favourite modules:", error);
    return [];
  }
}
