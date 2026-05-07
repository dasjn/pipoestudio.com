import { create } from "zustand";

interface TrabajosState {
  page: number;
  setPage: (page: number) => void;
}

export const useTrabajosStore = create<TrabajosState>((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
}));
