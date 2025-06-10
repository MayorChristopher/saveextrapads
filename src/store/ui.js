// store/ui.js
import { create } from 'zustand';

export const useUI = create((set) => ({
  isSignUpModalOpen: false,
  openSignUpModal: () => set({ isSignUpModalOpen: true }),
  closeSignUpModal: () => set({ isSignUpModalOpen: false }),
}));
