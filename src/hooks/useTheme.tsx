import { ThemeContext_ } from "../context/ThemeContext";
import { useContext } from "react";

export const useTheme = () => {
  const context = useContext(ThemeContext_);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};