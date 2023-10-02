import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FieldValues, RegisterFormValues } from "../../types";

import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";

import authService from "../../services/authService";
import { authenticate } from "../../redux/slices/userSlice";
import { useAppDispatch } from "../../app/reduxHooks";

const RegisterModal= () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const defaultFormValues = {
    name: '',
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

  const onSubmit = (data: FieldValues<RegisterFormValues>) => {
    setIsLoading(true);

    authService.register(data)
      .then((registerResponse) => {
        toast.success('Registered!');
        dispatch(authenticate(registerResponse));
        registerModal.onClose();
        reset(defaultFormValues);
      })
      .catch((error) => {
        toast.error(error?.response?.data || "An unexpected error occurred. Please sign up again.");
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div>
      <Heading
        title="Welcome to ScenicSymphony Tours"
        subtitle="Create an account!"
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
        required
      />
    </div>
  )

  const footerContent = (
    <div>
      <hr />
      <div>
        <p>Already have an account?
          <span
            onClick={onToggle}
            > Log in</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
