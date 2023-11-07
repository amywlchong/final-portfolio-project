import { create } from "zustand";

interface LocationSearchStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useLocationSearchModal = create<LocationSearchStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useLocationSearchModal;
