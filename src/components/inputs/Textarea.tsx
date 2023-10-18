import {
  FieldErrors,
  UseFormRegister
} from "react-hook-form";
import { FieldValues, nestedFieldErrors } from "../../types";
import { Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import { getNestedError, isErrorStructureNested } from "../../utils/dataProcessing";

interface TextareaProps {
  id: string;
  label: string;
  arrayName?: string;
  index?: number;
  minRows?: number;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors | nestedFieldErrors;
}

const Textarea = ({
  id,
  label,
  arrayName,
  index,
  minRows,
  disabled,
  required,
  register,
  errors
}: TextareaProps) => {

  const errorForField = arrayName && index !== undefined
    ? isErrorStructureNested(errors, index) && getNestedError(errors as nestedFieldErrors, arrayName, index, id)
    : errors[id];

  return (
    <div>
      <label>
        <Typography
          variant="body1"
          component="span"
          style={{ color: errorForField ? 'red' : 'inherit' }}
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
