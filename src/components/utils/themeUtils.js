// Theme utility functions
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };
  
  // Function to toggle theme
  export const toggleTheme = (currentTheme) => {
    return currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  };
  
  // Get theme colors based on current theme
  export const getThemeColors = (theme) => {
    if (theme === THEMES.DARK) {
      return {
        primary: '#2563eb', // Blue for dark mode
        secondary: '#1e293b', // Dark slate for dark mode
        background: '#0f172a', // Very dark blue for background
        text: '#f8fafc', // Light color for text
        cardBg: '#1e293b', // Dark slate for card backgrounds
        navBg: '#0f172a', // Very dark blue for navbar
        footerBg: '#0f172a', // Very dark blue for footer
      };
    }
    
    return {
      primary: '#e53e3e', // Red for light mode (from the images)
      secondary: '#ffffff', // White for light mode
      background: '#f5f5f5', // Light gray for background
      text: '#111827', // Dark for text
      cardBg: '#ffffff', // White for card backgrounds
      navBg: '#ffffff', // White for navbar
      footerBg: '#e53e3e', // Red for footer
    };
  };
  
  // Apply theme to document
  export const applyTheme = (theme) => {
    const colors = getThemeColors(theme);
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--background-color', colors.background);
    document.documentElement.style.setProperty('--text-color', colors.text);
    document.documentElement.style.setProperty('--card-bg', colors.cardBg);
    document.documentElement.style.setProperty('--nav-bg', colors.navBg);
    document.documentElement.style.setProperty('--footer-bg', colors.footerBg);
    
    // Set the data-theme attribute on the document for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
  };