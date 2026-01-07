import { StateCreator } from 'zustand';
import { UIState, initialUIState } from './types';

export interface UISlice {
  ui: UIState;

  // Tab actions
  setActiveTab: (tab: 'rabbitmq' | 'kafka' | 'comparison') => void;

  // Theme actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  ui: initialUIState,

  // Set active tab
  setActiveTab: (tab) =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeTab: tab,
      },
    })),

  // Set theme
  setTheme: (theme) =>
    set((state) => ({
      ui: {
        ...state.ui,
        theme,
      },
    })),

  // Toggle theme between light and dark
  toggleTheme: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        theme: state.ui.theme === 'light' ? 'dark' : 'light',
      },
    })),
});
