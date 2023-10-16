import { create } from 'zustand';

interface AdminBookingModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAdminBookingModal = create<AdminBookingModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useAdminBookingModal;
