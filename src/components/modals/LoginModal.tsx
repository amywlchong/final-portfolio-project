import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FieldValues, LoginFormValues } from "../../types";

import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";

import authService from "../../services/authService";
import { useAppDispatch } from "../../app/reduxHooks";
import { authenticate } from "../../redux/slices/userSlice";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const defaultFormValues = {
    email: '',
    password: ''
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: defaultFormValues,
  });

  const onModalClose = () => {
    reset(defaultFormValues);
    loginModal.onClose();
  }

  const onSubmit = async (data: FieldValues<LoginFormValues>) => {
    const loginHandler = createServiceHandler(authService.login, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please log in again.")}});

    const response = await loginHandler(data);

    if (response.success && response.data) {
      toast.success('Logged in');
      dispatch(authenticate(response.data));
      onModalClose();
    }
  };

  const onToggle = useCallback(() => {
    onModalClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div>
      <Heading
        title="Welcome back"
        subtitle="Login to your account!"
      />
      <Input
        id="email"
        label="Email"
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
        required
      />
    </div>
  )

  const footerContent = (
    <div>
      <hr />
      <div>
        <p>First time here?
          <span
            onClick={onToggle}
            > Create an account</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={onModalClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;
