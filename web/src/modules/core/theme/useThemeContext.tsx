import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
