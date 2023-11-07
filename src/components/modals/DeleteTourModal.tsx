import { useState } from "react";
import { toast } from "react-hot-toast";

import useDeleteTourModal from "../../hooks/useDeleteTourModal";
import Modal from "./Modal";

import tourService from "../../services/tourService";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import { Tour } from "../../types";
import { Box, Typography } from "@mui/material";
import LabeledText from "../LabeledText";

interface DeleteTourModalProps {
  tourToDelete: Tour;
  handleSuccessfulDelete: (tourDeleted: Tour) => void;
  onClose: () => void;
}

const DeleteTourModal = ({ tourToDelete, handleSuccessfulDelete, onClose }: DeleteTourModalProps) => {
  const deleteTourModal = useDeleteTourModal();
  const [isLoading, setIsLoading] = useState(false);

  const onModalClose = () => {
    deleteTourModal.onClose();
    onClose();
  };

  const onSubmit = async () => {
    const deleteTourHandler = createServiceHandler(tourService.deleteTour, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.");}});

    const response = await deleteTourHandler(tourToDelete.id);

    if (response.success && response.data) {
      toast.success("Deleted tour");
      handleSuccessfulDelete(tourToDelete);
      onModalClose();
    }
  };

  const bodyContent = (
    <div>
      <Typography variant="body1" color="#D32F2F">
        Are you sure you want to permanently delete this tour? This action is NOT reversible.
      </Typography>
      <Box mt={2}>
        <Typography variant="body1" fontWeight="bold">Tour Details</Typography>
        <LabeledText label="ID" value={tourToDelete.id} />
        <LabeledText label="Name" value={tourToDelete.name} />
        <LabeledText label="Location" value={tourToDelete.region} />
        <LabeledText label="Duration" value={tourToDelete.duration} />
      </Box>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={deleteTourModal.isOpen}
      title="Delete Tour"
      actionLabel="Confirm Deletion"
      onClose={onModalClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default DeleteTourModal;
