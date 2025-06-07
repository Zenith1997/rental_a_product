import { create } from 'zustand';

const useSearchStore = create((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    clearSearchQuery: () => set({ searchQuery: '' }),
}));

export default useSearchStore; 