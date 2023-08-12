import { create } from "zustand";

interface SubscribeModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useSubscribeModal = create<SubscribeModalStore>((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}))