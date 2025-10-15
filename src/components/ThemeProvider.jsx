import { useState, useEffect } from 'react';

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem('darkMode')) || false
  );
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  const toggleDarkMode = () => {
    setIsThemeChanging(true);
    setDarkMode((prev) => !prev);

    setTimeout(() => {
      setIsThemeChanging(false);
    }, 300);
  };

  useEffect(() => {
    const root = document.documentElement;

    darkMode ? root.classList.add('dark') : root.classList.remove('dark');

    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="theme-wrapper">
      <div className="content">{children}</div>

      <div className="theme-switcher">
        <button
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="mode-btns"
        >
          <i className="bx bx-sun text-md" />
          <i className="bx bx-moon text-md" />
          <span
            className={`mode-thumb ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default ThemeProvider;
