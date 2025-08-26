import { useState, useEffect } from 'react';

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = media.matches ? 'dark' : 'light';
      document.documentElement.className = systemTheme;

      const listener = (e) => {
        document.documentElement.className = e.matches ? 'dark' : 'light';
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      document.documentElement.className = theme;
    }
  }, [theme]);

  return (
    <div className="theme-wrapper">
      <div className="theme-switcher">
        <i className="bx bx-sun" onClick={() => setTheme('light')}></i>
        <i className="bx bx-moon" onClick={() => setTheme('dark')}></i>
        <i className="bx bx-laptop" onClick={() => setTheme('system')}></i>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}

export default ThemeProvider;
