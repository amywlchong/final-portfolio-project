import {
  FieldErrors,
  UseFormRegister
} from "react-hook-form";
import { FieldValues } from "../../types";
import { Typography } from "@mui/material";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors
}

const Input = ({
  id,
  label,
  type = "text",
  disabled,
  register,
  required,
  errors,
}: InputProps) => {
  return (
    <div>
      <label>
        <Typography variant="body1" component="span">{label}</Typography>
      </label>
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" "
        type={type}
      />
    </div>
   );
}

export default Input;
