import {
  Autocomplete,
  Box,
  InputLabel,
  TextField,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import { Controller, FieldErrors } from "react-hook-form";

interface AutocompleteControllerProps {
  id: string;
  control: any;
  rules?: any;
  defaultValue: any;
  label: string;
  boldLabel?: boolean;
  options: any[];
  getOptionLabel?: (option: any) => string;
  freeSolo?: boolean;
  errors: FieldErrors;
  onChange?: (newValue: any) => void;
  disabled?: boolean;
  placeholder?: string;
  render?: (params: any) => JSX.Element;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const AutocompleteController = ({
  id,
  control,
  rules,
  defaultValue,
  label,
  boldLabel,
  options,
  getOptionLabel,
  freeSolo,
  errors,
  onChange,
  disabled,
  placeholder,
  render,
  isOptionEqualToValue,
  fullWidth = true,
  sx,
}: AutocompleteControllerProps) => {
  return (
    <Box mb={2}>
      <InputLabel htmlFor={`autocomplete-${id}`}>
        <Typography variant="body1" fontWeight={boldLabel ? "bold" : "normal"}>
          {label}
        </Typography>
      </InputLabel>
      <Controller
        name={id}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Autocomplete
            id={`autocomplete-${id}`}
            options={options}
            getOptionLabel={getOptionLabel}
            value={field.value}
            onChange={(_, newValue) => {
              field.onChange(newValue);
              if (onChange) {
                onChange(newValue);
              }
            }}
            disabled={disabled}
            renderInput={
              render ||
              ((params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  placeholder={placeholder}
                  fullWidth={fullWidth}
                  sx={sx}
                  error={!!errors[id]}
                  helperText={errors[id] ? `${label} is required` : ""}
                />
              ))
            }
            isOptionEqualToValue={isOptionEqualToValue}
            freeSolo={freeSolo}
            autoSelect={freeSolo}
          />
        )}
      />
    </Box>
  );
};

export default AutocompleteController;
