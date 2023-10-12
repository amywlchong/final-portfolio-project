import { InputLabel, Select, FormControl, SxProps, Theme } from '@mui/material';
import { ReactElement } from 'react';

interface Props<T extends { toString(): string }> {
  label: string;
  selectedOptions: T[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<T[]>>;
  menuItems: Array<ReactElement>;
  sx?: SxProps<Theme>;
  formControlSize?: "small" | "medium";
}

const MultiSelect = <T extends { toString(): string }>({ label, selectedOptions, setSelectedOptions, menuItems, sx, formControlSize }: Props<T>) => {

  const MAX_LENGTH = 15;

  return (
    <FormControl fullWidth sx={sx} size={formControlSize}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedOptions}
        onChange={({ target }) => {
          const newSelected = target.value as T[];
          setSelectedOptions(newSelected);
        }}
        renderValue={(selected) => {
          const joinedValue = selected.join(', ');
          return joinedValue.length > MAX_LENGTH ? `${joinedValue.slice(0, MAX_LENGTH - 3)}...` : joinedValue;
        }}
      >
        {menuItems}
      </Select>
    </FormControl>
  )
}

export default MultiSelect;
