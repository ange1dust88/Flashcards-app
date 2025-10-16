"use client";

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useUserStore } from "@/store/userStore";
import { getUserByUid } from "@/app/firebase/users";

export default function UserSync() {
  const [user] = useAuthState(auth);
  console.log(user);
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        clearUser();
        return;
      }

      try {
        const usr = await getUserByUid(user.uid);
        if (usr) {
          setUser({
            email: usr.email,
            username: usr.username,
            photoURL: usr.photoURL,
            bannerURL: usr.bannerURL,
            createdAt: usr.createdAt?.toDate
              ? usr.createdAt.toDate().toISOString()
              : null,
          });
        } else {
          clearUser();
        }
      } catch (err) {
        console.error("Error syncing user:", err);
        clearUser();
      }
    };

    fetchUserData();
  }, [user, setUser, clearUser]);

  return null;
}
