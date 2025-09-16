import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';

export type DateFilterValue = 'month' | '6months' | 'year' | '6years' | 'all';

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ value, onChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 180 }}>
      <InputLabel id="date-filter-label">Date Range</InputLabel>
      <Select
        labelId="date-filter-label"
        value={value}
        onChange={e => onChange(e.target.value as DateFilterValue)}
        input={<OutlinedInput label="Date Range" />}
      >
        <MenuItem value="month">Past Month</MenuItem>
        <MenuItem value="6months">Past 6 Months</MenuItem>
        <MenuItem value="year">Past Year</MenuItem>
        <MenuItem value="6years">Past 6 Years</MenuItem>
        <MenuItem value="all">All Time</MenuItem>
      </Select>
    </FormControl>
  );
};
