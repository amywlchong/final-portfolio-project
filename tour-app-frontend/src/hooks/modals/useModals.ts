import { create } from "zustand";
import { Range } from "react-date-range";
import { addDays, subDays } from "date-fns";
import { createGenericModal } from "./useGenericModal";

export const useAdminBookingModal = createGenericModal();
export const useBookingModal = createGenericModal();
export const useDateSearchModal = createGenericModal();
export const useDeleteBookingModal = createGenericModal();
export const useDeleteTourModal = createGenericModal();
export const useDeleteUserModal = createGenericModal();
export const useLocationSearchModal = createGenericModal();
export const useLoginModal = createGenericModal();
export const useRegisterModal = createGenericModal();
export const useReviewModal = createGenericModal();
export const useUpdatePasswordModal = createGenericModal();

type Type = "past" | "future";

interface DateFilterModalState {
  filterDateRange: Range;
  setFilterDateRange: (newRange: Range) => void;
  setType: (type: Type) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Helper function to get the initial date range based on the booking type
const getInitialDateRange = (type: Type): Range => {
  const today = new Date();
  if (type === "future") {
    return {
      startDate: today,
      endDate: addDays(today, 365),
      key: "selection",
    };
  } else { // "past"
    return {
      startDate: subDays(today, 365),
      endDate: today,
      key: "selection",
    };
  }
};

export const useDateFilterModal = create<DateFilterModalState>((set) => ({
  // Initial state for the date range
  filterDateRange: getInitialDateRange("future"), // Default to "future"
  // Function to update the date range
  setFilterDateRange: (newRange: Range) =>
    set((state) => ({ ...state, filterDateRange: newRange })),
  setType: (type: Type) =>
    set({
      filterDateRange: getInitialDateRange(type),
    }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
