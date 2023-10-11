import { create } from 'zustand';

interface UpdatePasswordModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUpdatePasswordModal = create<UpdatePasswordModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useUpdatePasswordModal;
