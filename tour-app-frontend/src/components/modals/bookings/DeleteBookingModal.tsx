import { useState } from "react";
import { toast } from "react-hot-toast";

import { useDeleteBookingModal } from "../../../hooks/modals/useModals";
import Modal from "../Modal";

import bookingService from "../../../services/bookingService";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import { BookingResponse } from "../../../types";
import { formatDateAndTime } from "../../../utils/dataProcessing";
import { Box, Typography } from "@mui/material";
import LabeledText from "../../ui/LabeledText";

interface DeleteBookingModalProps {
  bookingToDelete: BookingResponse;
  handleSuccessfulDelete: (bookingDeleted: BookingResponse) => void;
  onClose: () => void;
}

const DeleteBookingModal = ({
  bookingToDelete,
  handleSuccessfulDelete,
  onClose,
}: DeleteBookingModalProps) => {
  const deleteBookingModal = useDeleteBookingModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const onModalClose = () => {
    deleteBookingModal.onClose();
    onClose();
  };

  const onSubmit = async () => {
    const deleteBookingHandler = createServiceHandler(
      bookingService.deleteBooking,
      {
        startLoading: () => setIsDeleting(true),
        endLoading: () => setIsDeleting(false),
      },
      {
        handle: (error: ApiError) => {
          toast.error(
            error.response?.data ||
              "An unexpected error occurred while deleting the booking. Please try again."
          );
        },
      }
    );

    const response = await deleteBookingHandler(bookingToDelete.id);

    if (response.success && response.data) {
      toast.success("Deleted booking");
      handleSuccessfulDelete(bookingToDelete);
      onModalClose();
    }
  };

  const bodyContent = (
    <div>
      <Typography variant="body1" color="#D32F2F">
        Are you sure you want to permanently delete this booking? This action is
        NOT reversible.
      </Typography>
      <Box mt={2}>
        <Typography variant="body1" fontWeight="bold">
          Booking Details
        </Typography>
        <LabeledText label="Booking ID" value={bookingToDelete.id} />
        <LabeledText
          label="User"
          value={`${bookingToDelete.userName} (ID: ${bookingToDelete.userId})`}
        />
        <LabeledText label="Tour" value={bookingToDelete.tourName} />
        <LabeledText
          label="Start Date & Time"
          value={formatDateAndTime(bookingToDelete.startDateTime)}
        />
        <LabeledText
          label="Number of Participants"
          value={bookingToDelete.numberOfParticipants}
        />
        <LabeledText
          label="Total Price"
          value={`$${bookingToDelete.totalPrice}`}
        />
        <LabeledText
          label="Paid?"
          value={bookingToDelete.paid ? "Yes" : "No"}
        />
      </Box>
    </div>
  );

  return (
    <Modal
      disabled={isDeleting}
      isOpen={deleteBookingModal.isOpen}
      title="Delete Booking"
      actionLabel="Confirm Deletion"
      onClose={onModalClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default DeleteBookingModal;
