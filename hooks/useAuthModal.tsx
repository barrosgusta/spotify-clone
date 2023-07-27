import { create } from "zustand";

interface AuthModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}))