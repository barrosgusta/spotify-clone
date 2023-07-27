import { create } from "zustand";

interface UploadModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useUploadModal = create<UploadModalStore>((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}))