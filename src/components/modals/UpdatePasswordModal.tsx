import { useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FieldValues, UpdatePasswordValues } from "../../types";

import useUpdatePasswordModal from "../../hooks/useUpdatePasswordModal";

import Modal from "./Modal";
import Input from "../inputs/Input";

import authService from "../../services/authService";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";

const UpdatePasswordModal = () => {
  const updatePasswordModal = useUpdatePasswordModal();
  const [isLoading, setIsLoading] = useState(false);

  const defaultFormValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: defaultFormValues,
  });
  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");
  const confirmNewPasswordValue = watch("confirmNewPassword");

  const onModalClose = () => {
    reset(defaultFormValues);
    updatePasswordModal.onClose();
  }

  const onUpdatePassword = async (data: FieldValues<UpdatePasswordValues>) => {
    const updatePasswordHandler = createServiceHandler(authService.updatePassword, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.")}});

    const response = await updatePasswordHandler(data);

    if (response.success && response.data) {
      toast.success('Updated password');
      onModalClose();
    }
  }

  const onSubmit = async () => {
    if (newPasswordValue === confirmNewPasswordValue) {
      await onUpdatePassword({
        oldPassword: currentPasswordValue,
        newPassword: newPasswordValue
      });
    } else {
      toast.error('Passwords do not match!');
    }
  };

  const bodyContent = (
    <div>
      <Input
        id="currentPassword"
        label="Current Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="newPassword"
        label="New Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={updatePasswordModal.isOpen}
      title="Update Password"
      actionLabel="Confirm"
      onClose={onModalClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default UpdatePasswordModal;
