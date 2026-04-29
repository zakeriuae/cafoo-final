'use client'

import { create } from 'zustand'

interface AuthModalStore {
  isOpen: boolean
  onOpen: (next?: string) => void
  onClose: () => void
  nextUrl: string | null
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  nextUrl: null,
  onOpen: (next) => set({ isOpen: true, nextUrl: next || null }),
  onClose: () => set({ isOpen: false, nextUrl: null }),
}))
