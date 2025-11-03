'use client';

import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

export const useThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return { theme, toggleTheme, mounted };
};
