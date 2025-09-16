import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

interface StoreFilterProps {
  stores: string[];
  selectedStores: string[];
  onChange: (selected: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const StoreFilter: React.FC<StoreFilterProps> = ({ stores, selectedStores, onChange }) => {
  return (
    <FormControl sx={{ m: 1, width: 250 }}>
      <InputLabel id="store-filter-label">Stores</InputLabel>
      <Select
        labelId="store-filter-label"
        multiple
        value={selectedStores}
        onChange={e => onChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
        input={<OutlinedInput label="Stores" />}
        renderValue={selected => (selected as string[]).join(', ')}
        MenuProps={MenuProps}
      >
        {stores.map(store => (
          <MenuItem key={store} value={store}>
            <Checkbox checked={selectedStores.indexOf(store) > -1} />
            <ListItemText primary={store} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
