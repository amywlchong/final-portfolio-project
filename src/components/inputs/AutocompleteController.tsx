import { Controller, FieldErrors } from 'react-hook-form';
import { Autocomplete, Box, InputLabel, TextField, Typography } from '@mui/material';

interface AutocompleteControllerProps {
  id: string;
  control: any;
  rules?: any;
  defaultValue: any;
  label: string;
  options: any[];
  getOptionLabel?: (option: any) => string;
  errors: FieldErrors;
  onChange?: (newValue: any) => void;
  disabled: boolean;
  placeholder: string;
  renderInput?: (params: any) => JSX.Element;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
}

const AutocompleteController = ({
  id,
  control,
  rules,
  defaultValue,
  label,
  options,
  getOptionLabel,
  errors,
  onChange,
  disabled,
  placeholder,
  renderInput,
  isOptionEqualToValue,
}: AutocompleteControllerProps) => {
  return (
    <Box mb={2}>
      <InputLabel htmlFor={`autocomplete-${id}`} style={{ color: errors[id] ? 'red' : 'inherit' }}>
        <Typography variant="body1">{label}</Typography>
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
            renderInput={renderInput || ((params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder={placeholder}
              />
            ))}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        )}
      />
    </Box>
  );
};

export default AutocompleteController;
