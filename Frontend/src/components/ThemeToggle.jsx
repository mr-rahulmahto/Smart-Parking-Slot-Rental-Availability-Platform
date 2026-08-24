import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle-btn"
      onClick={onToggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className={`theme-toggle-track ${isDark ? 'dark' : 'light'}`}>
        <div className="theme-toggle-icons">
          <Sun size={12} className="theme-icon sun-icon" />
          <Moon size={12} className="theme-icon moon-icon" />
        </div>
        <div className={`theme-toggle-thumb ${isDark ? 'dark' : 'light'}`}>
          {isDark ? (
            <Moon size={11} color="#312e81" />
          ) : (
            <Sun size={11} color="#f59e0b" />
          )}
        </div>
      </div>
    </button>
  );
}
