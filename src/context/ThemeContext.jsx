import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

/**
 * ThemeProvider component to manage theme state
 * @param {*} param0 
 * @returns 
 */
export const ThemeProvider = ({ children }) => {
    /**
     * State for the dark mode preference
     */
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    /**
     * Update the theme based on the darkMode state
     */
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode: () => setDarkMode(!darkMode) }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);