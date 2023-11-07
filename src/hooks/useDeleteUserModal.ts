import { create } from "zustand";

interface DeleteUserModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDeleteUserModal = create<DeleteUserModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useDeleteUserModal;
