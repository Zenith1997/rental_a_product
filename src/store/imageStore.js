import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useImageStore = create(
    persist(
        (set, get) => ({
            // State
            images: [],
            currentImage: null,
            loading: false,
            error: null,

            // Actions
            setImages: (images) => set({ images }),
            
            addImage: (image) => set((state) => ({
                images: [...state.images, image]
            })),

            removeImage: (imageId) => set((state) => ({
                images: state.images.filter(img => img.id !== imageId)
            })),

            updateImage: (imageId, updatedImage) => set((state) => ({
                images: state.images.map(img => 
                    img.id === imageId ? { ...img, ...updatedImage } : img
                )
            })),

            setCurrentImage: (image) => set({ currentImage: image }),

            clearImages: () => set({ images: [], currentImage: null }),

            // Async actions
            uploadImage: async (file) => {
                set({ loading: true, error: null });
                try {
                    // Here you would typically make an API call to upload the image
                    // For now, we'll just create a local object
                    const newImage = {
                        id: Date.now(),
                        url: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uploadedAt: new Date().toISOString()
                    };
                    
                    set((state) => ({
                        images: [...state.images, newImage],
                        loading: false
                    }));
                    
                    return newImage;
                } catch (error) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            // Selectors
            getImageById: (imageId) => {
                const state = get();
                return state.images.find(img => img.id === imageId);
            },

            getImagesByType: (type) => {
                const state = get();
                return state.images.filter(img => img.type.startsWith(type));
            }
        }),
        {
            name: 'image-storage', // unique name for localStorage
            partialize: (state) => ({ images: state.images }), // only persist images array
        }
    )
);

export default useImageStore; 