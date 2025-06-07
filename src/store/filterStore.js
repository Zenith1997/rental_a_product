import { create } from 'zustand';

const useFilterStore = create((set) => ({
    // Filter states
    page: 1,
    limit: 10,
    flocation: '',
    delivery_type: '',
    ava_from: '',
    ava_to: '',
    product_name: '',
    priceMin: '',
    priceMax: '',
    category: '',
    filterOn: false,
    filteredProducts: [],

    // Actions
    setFilter: (key, value) => set({ [key]: value }),
    
    // Set filtered products
    setFilteredProducts: (products) => set({ filteredProducts: products }),
    
    // Reset all filters
    resetFilters: () => set((state) => ({
        ...state,
        page: 1,
        limit: 10,
        flocation: '',
        delivery_type: '',
        ava_from: '',
        ava_to: '',
        product_name: '',
        priceMin: '',
        priceMax: '',
        category: '',
        filterOn: false,
        filteredProducts: []
    })),

    // Apply filters - updates multiple filter states at once
    applyFilters: (filters) => set({
        ...filters,
        filterOn: true
    }),

    // Toggle filter status
    toggleFilter: () => set((state) => ({ filterOn: !state.filterOn }))
}));

export default useFilterStore; 