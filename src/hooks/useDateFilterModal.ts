import { create } from "zustand";

interface DateFilterStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDateFilterModal = create<DateFilterStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useDateFilterModal;
