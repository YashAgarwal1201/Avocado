// src/stores/widgetStore.ts
import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

const LS_KEY = 'selected_widgets';

export const useWidgetStore = defineStore('widget', () => {
    const allWidgets = [
        {key: 'profile', label: 'Basic Profile'},
        {key: 'repos', label: 'Repo List'},
        {key: 'prs', label: 'Open PRs'},
        {key: 'notifications', label: 'Notifications'},
        {key: 'contributions', label: 'Contributions'},
    ];

    // Current selected widgets (from localStorage)
    const selectedWidgets = ref<string[]>(
        JSON.parse(localStorage.getItem(LS_KEY) || '["profile","repos","prs","notifications", "contributions"]')
    );

    // Temporary working copy for editing
    const workingWidgets = ref<string[]>([...selectedWidgets.value]);

    // Check if there are unsaved changes
    const hasUnsavedChanges = computed(() => {
        return JSON.stringify(selectedWidgets.value) !== JSON.stringify(workingWidgets.value);
    });

    const saveChanges = () => {
        selectedWidgets.value = [...workingWidgets.value];
        localStorage.setItem(LS_KEY, JSON.stringify(selectedWidgets.value));
    };

    const cancelChanges = () => {
        workingWidgets.value = [...selectedWidgets.value];
    };

    return {
        allWidgets,
        selectedWidgets,
        workingWidgets,
        hasUnsavedChanges,
        saveChanges,
        cancelChanges
    };
});
