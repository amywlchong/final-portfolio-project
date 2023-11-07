import { create } from "zustand";

interface DateSearchStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDateSearchModal = create<DateSearchStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useDateSearchModal;
