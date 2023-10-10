import {
  FieldErrors,
  UseFormRegister
} from "react-hook-form";
import { FieldValues } from "../../types";
import { Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base";

interface TextareaProps {
  id: string;
  label: string;
  minRows?: number;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Textarea = ({
  id,
  label,
  minRows,
  disabled,
  required,
  register,
  errors
}: TextareaProps) => {
  return (
    <div>
      <label>
        <Typography
          variant="body1"
          component="span"
          style={{ color: errors[id] ? 'red' : 'inherit' }}
        >
          {label}
        </Typography>
      </label>
      <TextareaAutosize
        id={id}
        {...register(id, { required })}
        disabled={disabled}
        minRows={minRows}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default Textarea;
