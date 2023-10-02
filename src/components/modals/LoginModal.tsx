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

  const onSubmit = (data: FieldValues<LoginFormValues>) => {
    setIsLoading(true);

    authService.login(data)
      .then((loginResponse) => {
        toast.success('Logged in');
        dispatch(authenticate(loginResponse));
        loginModal.onClose();
        reset(defaultFormValues);
      })
      .catch((error) => {
        toast.error(error?.response?.data || "An unexpected error occurred. Please log in again.");
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const onToggle = useCallback(() => {
    loginModal.onClose();
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
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;
