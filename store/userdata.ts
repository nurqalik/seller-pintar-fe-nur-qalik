import { create } from 'zustand'

interface UserData {
  username: string
  password: string
}

interface UserDataStore {
  userData: UserData
  setUserData: (username: string, password: string) => void
  clearUserData: () => void
}

export const useUserDataStore = create<UserDataStore>((set) => ({
  userData: {
    username: '',
    password: ''
  },
  setUserData: (username: string, password: string) => 
    set({ userData: { username, password } }),
  clearUserData: () => 
    set({ userData: { username: '', password: '' } })
}))


interface totalArticle {
  total: number
}

interface totalArticles {
  totalArticle: totalArticle
  setTotalArticle: (total: number) => void
}

export const useTotalArticle = create<totalArticles>((set) => ({
  totalArticle: {
    total: 0
  },
  setTotalArticle: (total: number) => set({ totalArticle: { total: total } })
}))