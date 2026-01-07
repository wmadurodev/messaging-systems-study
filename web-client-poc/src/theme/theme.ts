import { createTheme, ThemeOptions } from '@mui/material/styles';
import { CHART_COLORS } from '../utils/constants';

// Common theme options
const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
  },
};

// Light theme
const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // Pink
      light: '#e33371',
      dark: '#9a0036',
    },
    success: {
      main: CHART_COLORS.SUCCESS,
    },
    error: {
      main: CHART_COLORS.ERROR,
    },
    warning: {
      main: CHART_COLORS.WARNING,
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    rabbitmq: {
      main: CHART_COLORS.RABBITMQ,
      light: '#FF8C61',
      dark: '#CC5529',
      contrastText: '#fff',
    },
    kafka: {
      main: CHART_COLORS.KAFKA,
      light: '#3374A8',
      dark: '#003A6E',
      contrastText: '#fff',
    },
  } as any,
});

// Dark theme
const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue for dark mode
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1', // Light pink for dark mode
      light: '#ffc1e3',
      dark: '#bf5f82',
    },
    success: {
      main: CHART_COLORS.SUCCESS,
    },
    error: {
      main: CHART_COLORS.ERROR,
    },
    warning: {
      main: CHART_COLORS.WARNING,
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    rabbitmq: {
      main: CHART_COLORS.RABBITMQ,
      light: '#FF8C61',
      dark: '#CC5529',
      contrastText: '#fff',
    },
    kafka: {
      main: CHART_COLORS.KAFKA,
      light: '#3374A8',
      dark: '#003A6E',
      contrastText: '#fff',
    },
  } as any,
});

export { lightTheme, darkTheme };

// Export default theme (light)
export default lightTheme;

// Extend MUI theme types for custom colors
declare module '@mui/material/styles' {
  interface Palette {
    rabbitmq: Palette['primary'];
    kafka: Palette['primary'];
  }
  interface PaletteOptions {
    rabbitmq?: PaletteOptions['primary'];
    kafka?: PaletteOptions['primary'];
  }
}
