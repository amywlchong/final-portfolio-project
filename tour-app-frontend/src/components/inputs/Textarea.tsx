import { InputLabel, Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FieldValues, nestedFieldErrors } from "../../types";
import {
  getNestedError,
  hasObjectAtArrayIndex,
} from "../../utils/dataProcessing";

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
  errors,
}: TextareaProps) => {
  const errorForField =
    arrayName && index !== undefined
      ? hasObjectAtArrayIndex(errors, index) &&
        getNestedError(errors as nestedFieldErrors, arrayName, index, id)
      : errors[id];

  return (
    <div>
      <InputLabel htmlFor={id}>
        <Typography variant="body1">{label}</Typography>
      </InputLabel>
      <TextareaAutosize
        id={id}
        {...register(id, { required })}
        disabled={disabled}
        minRows={minRows}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderColor: errorForField ? "#D32F2F" : "inherit",
        }}
      />
      <Typography color="#D32F2F" variant="caption" marginLeft="12px">
        {errorForField ? `${label} is required` : ""}
      </Typography>
    </div>
  );
};

export default Textarea;
