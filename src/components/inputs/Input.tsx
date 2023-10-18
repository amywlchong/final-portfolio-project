import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FieldValues, nestedFieldErrors } from "../../types";
import { Box, InputLabel, TextField, Typography } from "@mui/material";
import { getNestedError, isErrorStructureNested } from "../../utils/dataProcessing";

interface InputProps {
  id: string;
  label: string;
  arrayName?: string;
  index?: number;
  type?: string;
  min?: number;
  max?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors | nestedFieldErrors;
}

const Input = ({
  id,
  label,
  arrayName,
  index,
  type = "text",
  min,
  max,
  fullWidth = true,
  disabled,
  required,
  register,
  errors,
}: InputProps) => {

  const errorForField = arrayName && index !== undefined
    ? isErrorStructureNested(errors, index) && getNestedError(errors as nestedFieldErrors, arrayName, index, id)
    : errors[id];

  return (
    <Box mt={1} mb={1}>
      <InputLabel htmlFor={id} style={{ color: errorForField ? 'red' : 'inherit' }}>
        <Typography variant="body1">{label}</Typography>
      </InputLabel>
      <TextField
        hiddenLabel
        id={id}
        type={type}
        disabled={disabled}
        {...register(id, { required })}
        variant="outlined"
        size="small"
        fullWidth={fullWidth}
        inputProps={{ min, max }}
      />
    </Box>
  );
};

export default Input;
