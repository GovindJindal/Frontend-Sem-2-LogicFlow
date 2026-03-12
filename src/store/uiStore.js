import { create } from 'zustand'

export const useUiStore = create((set) => ({
  theme:          'dark',       // 'dark' | 'light'
  activeModule:   null,         // 'diode' | 'zener' | 'gates' | 'coa'
  quickLabStep:   0,
  isMobileMenuOpen: false,

  setTheme:          (t) => set({ theme: t }),
  setActiveModule:   (m) => set({ activeModule: m }),
  nextQuickLabStep:  ()  => set((s) => ({ quickLabStep: s.quickLabStep + 1 })),
  prevQuickLabStep:  ()  => set((s) => ({ quickLabStep: Math.max(0, s.quickLabStep - 1) })),
  resetQuickLab:     ()  => set({ quickLabStep: 0 }),
  toggleMobileMenu:  ()  => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
}))
