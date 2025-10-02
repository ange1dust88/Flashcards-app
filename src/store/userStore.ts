import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserState = {
  email: string | null
  username: string | null
  photoURL: string | null
  bannerURL: string | null
  createdAt: string | null
}

type UserActions = {
  setUser: (user: Partial<UserState>) => void
  clearUser: () => void
}

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
      name: 'user-storage', 
    }
  )
)
