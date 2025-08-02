import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useThemeContext } from '../theme/useThemeContext';
import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const { mode, toggleColorMode } = useThemeContext();
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (mode === 'light' && checked === true) toggleColorMode();

    if (mode === 'dark' && checked === false) toggleColorMode();
  }, [checked, mode, toggleColorMode]);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            slotProps={{ input: { 'aria-label': 'controlled' } }}
            color="secondary"
          />
        }
        label="Dark Mode"
      />
    </FormGroup>
  );
};

export default DarkModeToggle;
