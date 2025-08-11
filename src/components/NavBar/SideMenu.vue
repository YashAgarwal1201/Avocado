<script lang="ts" setup>
import {ref} from "vue";
import {FolderX, Home, Keyboard, MessageCircle, Palette, UserCircle, Wrench} from "lucide-vue-next"
import {Button, Drawer, Panel, Select} from "primevue";
import {useNavbarStore} from "../../pinia/navbarStore.ts";
import {DEVELOPER_PROFILE} from "../../constants/BaseConstants.ts";
import {useConfirm} from "primevue/useconfirm";
import toastHandler from "../../composables/toastHandler.ts";
import router from "../../router";
import {useTheme} from "../../composables/theme.ts";

const navbarStore = useNavbarStore()
const confirm = useConfirm();
const {showToast} = toastHandler()
const {theme, updateTheme} = useTheme();

const isPanelCollapsed = ref(true);
const isKeyboardPanelCollapsed = ref(true);

const buttonStyles =
    "!px-2 !py-4 !bg-transparent !!text-green-700 dark:!text-green-300 flex items-center !gap-x-3 !rounded-xl *:text-lg font-normal font-content";

// Toggle functions
const togglePanel = () => {
  isPanelCollapsed.value = !isPanelCollapsed.value;
};

const toggleKeyboardPanel = () => {
  isKeyboardPanelCollapsed.value = !isKeyboardPanelCollapsed.value;
};

// Theme change handler
const handleThemeChange = (selectedTheme: string) => {
  updateTheme(selectedTheme as 'light' | 'dark' | 'system' || 'system');
  showToast("info", "Theme Changed", `Switched to ${selectedTheme === 'system' ? 'system' : selectedTheme} mode`);
};

function confirmClearAppData() {
  confirm.require({
    message: "Clear all data?",
    header: "Confirm Clear App Data",
    icon: "pi pi-trash",
    rejectLabel: "Cancel",
    acceptLabel: "Yes, Clear",
    acceptClass: "p-button-secondary",

    accept: async () => {
      localStorage.removeItem('github_pat_token')
      await router.push("/");
      // toast.add({
      //   severity: "info",
      //   summary: "Store Cleared",
      //   detail: "All To-Do items deleted",
      //   life: 2000,
      // });

      showToast("info", "Info", "App data cleared")
    },
  });
}
</script>

<template>
  <div>

    <Drawer
        v-model:visible="navbarStore.isSideMenuOpen"
        :dismissable="true"
        class="!w-full md:!w-[768px] rounded-none md:!rounded-l-xl !bg-stone-100 dark:!bg-stone-800 font-content !text-green-700 dark:!text-green-300"
        position="right"
        v-on:hide="() => navbarStore.closeSideMenu()"
    >
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-xl sm:text-2xl font-heading text-yellow-600 dark:text-yellow-500">Menu</h3>


        </div>
      </template>

      <div class="w-full">
        <div class="flex flex-col">
          <div
              class="w-full flex flex-col rounded-xl bg-white dark:bg-stone-700 p-4"
          >
            <RouterLink :class="buttonStyles" to="/">
              <Home :size="16" class="text-yellow-600 dark:text-yellow-500"/>
              <span>Home</span>
            </RouterLink>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <RouterLink :class="buttonStyles" to=""
                        @click.prevent="() => showToast('info', 'Info', 'Coming soon')">
              <Wrench :size="16" class="text-yellow-600 dark:text-yellow-500"/>
              <span>Customise App</span>
            </RouterLink>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <Panel
                :class="buttonStyles"
                :collapsed="isKeyboardPanelCollapsed"
                class="!border-none *:!p-0 flex-col flex-wrap items-start font-content w-full"
                toggleable
            >
              <template #header class="w-full">
                <div
                    class="flex items-center w-full gap-x-3 cursor-pointer"
                    @click="toggleKeyboardPanel"
                >
                  <Keyboard :size="16" class="text-yellow-600 dark:text-yellow-500"/>
                  <h3 class="text-lg font-medium !text-green-700 dark:!text-green-300">
                    Keyboard Shortcuts
                  </h3>
                </div>
              </template>

              <template #toggleicon class="hidden">
                <div></div>
              </template>
              <div class="flex flex-col gap-2 py-2">
                <!--                <ul class="flex flex-col gap-1 list-disc list-inside">-->
                <!--                  <li class="flex items-center gap-x-3 !list-disc">-->
                <!--                    Press <kbd>Ctrl</kbd> + <kbd>H</kbd> for "Home" section-->
                <!--                  </li>-->
                <!--                  <li class="flex items-center gap-x-3 !list-disc">-->
                <!--                    Press <kbd>Ctrl</kbd> + <kbd>T</kbd> for "To-Do List" section-->
                <!--                  </li>-->
                <!--                  <li class="flex items-center gap-x-3 !list-disc">-->
                <!--                    Press <kbd>Ctrl</kbd> + <kbd>F</kbd> for "Feedback" section-->
                <!--                  </li>-->
                <!--                  <li class="flex items-center gap-x-3 !list-disc">-->
                <!--                    Press <kbd>Ctrl</kbd> + <kbd>M</kbd> for "Menu & others"-->
                <!--                  </li>-->
                <!--                </ul>-->
                <p>Coming soon.</p>
              </div>
            </Panel>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <!-- TODO: fix theming later -->
            <div :class="buttonStyles">
              <Palette :size="16" class="text-yellow-600 dark:text-yellow-500"/>
              <span>Theme</span>
              <Select
                  :modelValue="theme"
                  :options="[
                  { label: 'System', value: 'system' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Light', value: 'light' },
                ]"
                  class="ml-auto w-auto !text-sm !rounded-lg !bg-stone-50 dark:!bg-stone-900"
                  optionLabel="label"
                  optionValue="value"
                  @update:modelValue="handleThemeChange"
              />
            </div>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <Panel
                :class="buttonStyles"
                :collapsed="isPanelCollapsed"
                class="!border-none *:!p-0 flex-col flex-wrap items-start font-content w-full"
                toggleable
            >
              <template #header class="w-full">
                <div
                    class="flex items-center w-full gap-x-3 cursor-pointer"
                    @click="togglePanel"
                >
                  <FolderX :size="16" class="text-yellow-600 dark:text-yellow-500"/>
                  <h3 class="text-lg font-medium !text-green-700 dark:!text-green-300">
                    Manage App Storage
                  </h3>
                </div>
              </template>

              <template #toggleicon class="hidden">
                <div></div>
              </template>
              <div class="w-full flex flex-col gap-2 py-2">

                <div class="flex flex-wrap items-center gap-3">
                  <p class="flex flex-grow text-sm xl:text-base">
                    Clear app data?
                  </p>

                  <Button
                      class="!rounded-lg flex-shrink-0"
                      icon="pi pi-trash"
                      label="Clear app data"
                      severity="secondary"
                      size="small"
                      @click="() => confirmClearAppData()"
                  />
                </div>
              </div>
            </Panel>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>
            <Button
                :class="buttonStyles"
                class="!text-green-700 dark:!text-green-300 !border-none !flex !items-center !justify-start shadow-none"
                @click="() => {navbarStore.closeSideMenu(); navbarStore.openFeedbackMenu(); }"
            >
              <MessageCircle :size="16" class="text-yellow-600 dark:text-yellow-500"/>
              <span>Give Feedback</span>
            </Button>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>
            <a
                :class="buttonStyles"
                :href="DEVELOPER_PROFILE"
                class="!text-green-700 dark:!text-green-300 !border-none !flex !items-center !justify-start shadow-none"
                rel="noopener noreferrer nofollow"
                target="_blank"
            >
              <UserCircle :size="16" class="text-yellow-600 dark:text-yellow-500"/>
              <span>Developer Profile</span>
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
kbd {
  padding: 0 8px;
  border: 1px solid var(--color-stone-600);
  border-radius: 8px;
  color: var(--color-stone-400);
  font-family: var(--font-heading), serif;
}
</style>