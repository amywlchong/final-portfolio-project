import { useState } from "react";
import { toast } from "react-hot-toast";

import useDeleteBookingModal from "../../hooks/useDeleteBookingModal";
import Modal from "./Modal";

import bookingService from "../../services/bookingService";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import { BookingResponse } from "../../types";
import { Box, Typography } from "@mui/material";
import { formatDateAndTime } from "../../utils/dataProcessing";

interface DeleteBookingModalProps {
  bookingToDelete: BookingResponse;
  handleSuccessfulDelete: (bookingDeleted: BookingResponse) => void;
  onClose: () => void;
}

const DeleteBookingModal = ({ bookingToDelete, handleSuccessfulDelete, onClose }: DeleteBookingModalProps) => {
  const deleteBookingModal = useDeleteBookingModal();
  const [isLoading, setIsLoading] = useState(false);

  const onModalClose = () => {
    deleteBookingModal.onClose();
    onClose();
  }

  const onSubmit = async () => {
    const deleteBookingHandler = createServiceHandler(bookingService.deleteBooking, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred while deleting the booking. Please try again.")}});

    const response = await deleteBookingHandler(bookingToDelete.id);

    if (response.success && response.data) {
      toast.success('Deleted booking');
      handleSuccessfulDelete(bookingToDelete);
      onModalClose();
    }
  };

  const bodyContent = (
    <div>
      <Typography variant="body1" color="red">
        Are you sure you want to permanently delete this booking? This action is NOT reversible.
      </Typography>
      <Box mt={2}>
        <Typography variant="body1" fontWeight="bold">Booking Details:</Typography>
        <Typography variant="body1">Booking ID: {bookingToDelete.id}</Typography>
        <Typography variant="body1">User: {`${bookingToDelete.userName} (ID: ${bookingToDelete.userId})`}</Typography>
        <Typography variant="body1">Tour: {bookingToDelete.tourName}</Typography>
        <Typography variant="body1">Start Date & Time: {formatDateAndTime(bookingToDelete.startDateTime)}</Typography>
        <Typography variant="body1">Number of Participants: {bookingToDelete.numberOfParticipants}</Typography>
        <Typography variant="body1">Total Price: {bookingToDelete.totalPrice}</Typography>
        <Typography variant="body1">Paid? {bookingToDelete.paid ? 'Yes' : 'No'}</Typography>
      </Box>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={deleteBookingModal.isOpen}
      title="Delete Booking"
      actionLabel="Confirm Deletion"
      onClose={onModalClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
}

export default DeleteBookingModal;
