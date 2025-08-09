import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useNavbarStore = defineStore('navbar', () => {
    // State
    const isSideMenuOpen = ref<boolean>(false)

    // Actions
    function toggleSideMenu() {
        isSideMenuOpen.value = !isSideMenuOpen.value
    }

    function openSideMenu() {
        isSideMenuOpen.value = true
    }

    function closeSideMenu() {
        isSideMenuOpen.value = false
    }

    return {
        isSideMenuOpen,
        toggleSideMenu,
        openSideMenu,
        closeSideMenu,
    }
})
