import { create } from 'zustand';
import { type Locale } from '@/i18n.config';

interface LocaleState {
  // Estado actual del locale
  locale: Locale;
  
  // Acciones
  setLocale: (newLocale: Locale) => void;
}

// Store de locale
export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'es', // Default al español
  
  setLocale: (newLocale: Locale) => {
    set({ locale: newLocale });
  },
}));