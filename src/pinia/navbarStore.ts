import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useNavbarStore = defineStore('navbar', () => {
    // State
    const isSideMenuOpen = ref<boolean>(false)
    const isFeedbackMenuOpen = ref<boolean>(false)

    // Actions
    function toggleSideMenu() {
        isSideMenuOpen.value = !isSideMenuOpen.value
    }

    function toggleFeedbackMenu() {
        isFeedbackMenuOpen.value = !isFeedbackMenuOpen.value
    }

    function openSideMenu() {
        isSideMenuOpen.value = true
    }

    function openFeedbackMenu() {
        isFeedbackMenuOpen.value = true
    }

    function closeFeedbackMenu() {
        isFeedbackMenuOpen.value = false
    }

    function closeSideMenu() {
        isSideMenuOpen.value = false
    }

    return {
        isSideMenuOpen,
        isFeedbackMenuOpen,
        toggleSideMenu,
        toggleFeedbackMenu,
        openSideMenu,
        closeSideMenu,
        openFeedbackMenu,
        closeFeedbackMenu
    }
})
