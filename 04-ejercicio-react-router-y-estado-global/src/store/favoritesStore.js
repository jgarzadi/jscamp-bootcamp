import { create } from 'zustand'

export const useFavoritesStore = create((set, get, store) => ({
    //State
    favorites: [],

    clearFavorites: () => {
        set(store.getInitialState())
    },

    //Actions
    addFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.includes(jobId) 
                ? state.favorites 
                : [...state.favorites, jobId]
        }))
    },

    removeFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.filter((id) => id !== jobId)
        }))
    },

    isFavorite: (jobId) => {
        return get().favorites.includes(jobId)
    },

    toggleFavorite: (jobId) => {
        const { addFavorite, removeFavorite, isFavorite } = get()
        const isFav = isFavorite(jobId)
        isFav ? removeFavorite(jobId) : addFavorite(jobId)
    },

    favoritesCount: () => get().favorites.length

}))