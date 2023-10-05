import { InputLabel, Select, Box, Chip, FormControl } from '@mui/material';
import { ReactElement } from 'react';

interface Props<T extends { toString(): string }> {
  label: string;
  selectedOptions: T[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<T[]>>;
  menuItems: Array<ReactElement>;
}

const MultiSelect = <T extends { toString(): string }>({ label, selectedOptions, setSelectedOptions, menuItems }: Props<T>) => {

  return (
    <FormControl fullWidth sx={{ marginTop: '20px'}}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedOptions}
        onChange={({ target }) => {
          const newSelected = target.value as T[];
          setSelectedOptions(newSelected);
        }}
        renderValue={(selected) => selected.join(', ')}
      >
        {menuItems}
      </Select>
    </FormControl>
  )
}

export default MultiSelect;
