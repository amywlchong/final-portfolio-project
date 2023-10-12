import { useState } from "react";
import { toast } from "react-hot-toast";

import useDeleteUserModal from "../../hooks/useDeleteUserModal";
import Modal from "./Modal";

import userService from "../../services/userService";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../types";
import { Box, Typography } from "@mui/material";
import { roleToLabel } from "../../utils/dataProcessing";

interface DeleteUserModalProps {
  userToDelete: User;
  handleSuccessfulDelete: (userDeleted: User) => void;
  onClose: () => void;
}

const DeleteUserModal = ({ userToDelete, handleSuccessfulDelete, onClose }: DeleteUserModalProps) => {
  const deleteUserModal = useDeleteUserModal();
  const [isLoading, setIsLoading] = useState(false);

  const onModalClose = () => {
    deleteUserModal.onClose();
    onClose();
  }

  const onSubmit = async () => {
    const deleteUserHandler = createServiceHandler(userService.deleteUser, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.")}});

    const response = await deleteUserHandler(userToDelete.id);

    if (response.success && response.data) {
      toast.success('Deleted user');
      handleSuccessfulDelete(userToDelete);
      onModalClose();
    }
  };

  const bodyContent = (
    <div>
      <Typography variant="body1" color="red">
        Are you sure you want to permanently delete this user? This action is NOT reversible.
      </Typography>
      <Box mt={2}>
        <Typography variant="body1" fontWeight="bold">User Details:</Typography>
        <Typography variant="body1">ID: {userToDelete.id}</Typography>
        <Typography variant="body1">Name: {userToDelete.name}</Typography>
        <Typography variant="body1">Status: {userToDelete.active ? 'Active' : 'Inactive'}</Typography>
        <Typography variant="body1">Role: {roleToLabel(userToDelete.role)}</Typography>
      </Box>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={deleteUserModal.isOpen}
      title="Delete User"
      actionLabel="Confirm Deletion"
      onClose={onModalClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
}

export default DeleteUserModal;
