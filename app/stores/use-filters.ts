import { create } from "zustand";

export type StatusFilter = "all" | "active" | "paused" | "done";

interface FiltersState {
  statusFilter: StatusFilter;
  searchQuery: string;
  setStatusFilter: (value: StatusFilter) => void;
  setSearchQuery: (value: string) => void;
  resetFilters: () => void;
}

const initialState = {
  statusFilter: "all" as StatusFilter,
  searchQuery: "",
};

export const useFilters = create<FiltersState>()((set) => ({
  ...initialState,
  setStatusFilter: (value: StatusFilter) => set({ statusFilter: value }),
  setSearchQuery: (value: string) => set({ searchQuery: value }),
  resetFilters: () => set(initialState),
}));
