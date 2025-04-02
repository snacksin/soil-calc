// soil-calculator/app/components/DarkModeToggle.tsx
'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from './Icons'; // Assuming Icons.tsx exists and exports these

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Basic styling for the button - can be refined later
  const buttonStyle: React.CSSProperties = {
    background: 'var(--glass-background)',
    border: '1px solid var(--glass-border)',
    color: 'var(--color-foreground)',
    padding: '8px',
    borderRadius: '50%', // Make it circular
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px', // Fixed size
    height: '40px', // Fixed size
    position: 'absolute', // For positioning in the corner
    top: '20px', // Adjust as needed
    right: '20px', // Adjust as needed
    zIndex: 1000, // Ensure it's above other content
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  return (
    <button
      onClick={toggleTheme}
      style={buttonStyle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
    </button>
  );
}