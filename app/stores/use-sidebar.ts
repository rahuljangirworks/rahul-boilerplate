import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (value: boolean) => set({ isOpen: value }),
    }),
    {
      name: "sidebar-state",
    }
  )
);
