import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  email: string | null;
  username: string | null;
  photoURL: string | null;
  bannerURL: string | null;
  createdAt: string | null;
};

type UserActions = {
  setUser: (user: Partial<UserState>) => void;
  setPhotoURL: (url: string) => void;
  setBannerURL: (url: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      email: null,
      username: null,
      photoURL: null,
      bannerURL: null,
      createdAt: null,

      setUser: (user) =>
        set((state) => ({
          ...state,
          ...user,
        })),

      setPhotoURL: (url: string) =>
        set((state) => ({
          ...state,
          photoURL: url,
        })),

      setBannerURL: (url: string) =>
        set((state) => ({
          ...state,
          bannerURL: url,
        })),

      clearUser: () =>
        set({
          email: null,
          username: null,
          photoURL: null,
          bannerURL: null,
          createdAt: null,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);
