<script lang="ts" setup>
import BaseLayout from "../layout/BaseLayout.vue";
import {ref} from "vue";

// PrimeVue imports
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Button from "primevue/button";
import {useWidgetStore} from "../pinia/widgetsStore.ts";

const activeTab = ref("0");
const widgetStore = useWidgetStore();

const handleSave = () => {
  widgetStore.saveChanges();
  // Optional: Show success message
};

const handleCancel = () => {
  widgetStore.cancelChanges();
};
</script>

<template>
  <BaseLayout>
    <div class="w-full h-full p-3 font-content flex flex-col">
      <div class="flex flex-col flex-shrink-0"><h1
          class="text-2xl sm:text-3xl font-heading text-green-800 dark:text-green-400">
        Customise Application
      </h1>
        <p>You can customise your application here</p>
      </div>
      <Tabs v-model:value="activeTab"
            class="flex-grow-1 mt-6 !bg-stone-100 dark:!bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
        <TabList class="!bg-transparent *:!bg-transparent flex-shrink-0">
          <Tab value="0">Widgets to Show</Tab>
          <Tab value="1">Other Settings</Tab>
        </TabList>
        <TabPanels class="!bg-transparent h-full">
          <!-- Tab 1: Widget Selector -->
          <TabPanel class="!bg-transparent h-full" value="0">
            <div class="flex flex-col gap-4 h-full">
              <div>
                <h2 class="text-xl md:text-2xl font-heading mb-2">Select widgets to show on dashboard:</h2>
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label
                      v-for="widget in widgetStore.allWidgets"
                      :key="widget.key"
                      class="flex items-center gap-2"
                  >
                    <input
                        v-model="widgetStore.workingWidgets"
                        :value="widget.key"
                        type="checkbox"
                    />
                    <span>{{ widget.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Save/Cancel buttons -->
              <div class="flex justify-end gap-2 mt-auto">
                <Button
                    :disabled="!widgetStore.hasUnsavedChanges"
                    class="disabled:pointer-events-none h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm"
                    icon="pi pi-check"
                    label="Save Changes"
                    @click="handleSave"
                />
                <Button
                    :disabled="!widgetStore.hasUnsavedChanges"
                    class="h-8 !rounded-lg  !text-sm"
                    icon="pi pi-times"
                    label="Cancel"
                    outlined
                    severity="secondary"
                    @click="handleCancel"
                />
              </div>
            </div>
          </TabPanel>

          <!-- Tab 2: Placeholder -->
          <TabPanel value="1">
            <p>Add more customisation options here.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </BaseLayout>
</template>

<style lang="css">
.p-tablist-tab-list {
  background-color: transparent !important;
}
</style>
