import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FieldValues, RegisterFormValues } from "../../../types";

import { useRegisterModal } from "../../../hooks/modals/useModals";
import { useLoginModal } from "../../../hooks/modals/useModals";

import { Typography } from "@mui/material";
import Modal from "../Modal";
import Input from "../../inputs/Input";
import Heading from "../../ui/Heading";

import authService from "../../../services/authService";
import { authenticate } from "../../../redux/slices/userSlice";
import { useAppDispatch } from "../../../app/reduxHooks";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const defaultFormValues = {
    name: "",
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: defaultFormValues,
  });

  const onModalClose = () => {
    reset(defaultFormValues);
    registerModal.onClose();
  };

  const onSubmit = async (data: FieldValues<RegisterFormValues>) => {
    const registerHandler = createServiceHandler(
      authService.register,
      {
        startLoading: () => setIsLoading(true),
        endLoading: () => setIsLoading(false),
      },
      {
        handle: (error: ApiError) => {
          toast.error(
            error.response?.data ||
              "An unexpected error occurred. Please sign up again."
          );
        },
      }
    );

    const response = await registerHandler(data);

    if (response.success && response.data) {
      toast.success("Registered!");
      dispatch(authenticate(response.data));
      onModalClose();
    }
  };

  const onToggle = useCallback(() => {
    onModalClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div>
      <Heading title="Welcome to Scenic Symphony Tours!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        helperText="8-50 characters long, include digits, uppercase and lowercase letters, and special characters (!, @, #, $, %, ^, &, +, =)"
        required
      />
    </div>
  );

  const footerContent = (
    <div>
      <hr />
      <Typography variant="subtitle1" textAlign="center">
        Already have an account?
        <span
          onClick={onToggle}
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
            marginLeft: "5px",
            fontWeight: "bold",
          }}
        >
          Log in
        </span>
      </Typography>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create an account"
      actionLabel="Continue"
      onClose={onModalClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
