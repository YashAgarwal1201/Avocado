<template>
  <div
      class="w-full h-full flex flex-row md:flex-col items-center gap-1 text-white p-1"
  >
    <RouterLink
        class="w-auto md:w-full h-full md:h-auto p-button aspect-square flex justify-center items-center !border-none !rounded-2xl !bg-yellow-600 dark:!bg-yellow-500 hover:!bg-yellow-700 dark:hover:!bg-yellow-400"
        to="/"
    >
      <Home :size="16"/>
    </RouterLink>

    <Button
        class="w-auto md:w-full h-full md:h-auto aspect-square flex justify-center items-center !border-none !rounded-2xl !bg-yellow-600 dark:!bg-yellow-500 hover:!bg-yellow-700 dark:hover:!bg-yellow-400"
    >
      <MessageCircle :size="16"/>
    </Button>

    <Button
        class="w-auto md:w-full h-full md:h-auto aspect-square flex justify-center items-center !border-none !rounded-2xl !bg-yellow-600 dark:!bg-yellow-500 hover:!bg-yellow-700 dark:hover:!bg-yellow-400 ml-auto md:ml-0 mt-0 md:mt-auto"
        @click="openSideMenu"
    >
      <Menu :size="16"/>
    </Button>
  </div>
</template>

<script lang="ts" setup>
import {Home, Menu, MessageCircle} from "lucide-vue-next";
import {Button} from "primevue";
import {useNavbarStore} from "../../pinia/navbarStore.ts";

const navbarStore = useNavbarStore()

const {openSideMenu} = navbarStore
</script>

<style lang="css" scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
