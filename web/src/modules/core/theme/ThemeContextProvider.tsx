import { useColorTheme } from './useColorTheme';
import type { FC, PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useColorTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
