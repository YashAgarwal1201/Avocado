<script lang="ts" setup>
import {Drawer} from "primevue";
import {useNavbarStore} from "../../pinia/navbarStore.ts";

const navbarStore = useNavbarStore()

const {isSideMenuOpen, closeSideMenu} = navbarStore
</script>

<template>
  <div>
    <Drawer
        v-model:visible="isSideMenuOpen"
        :dismissable="true"
        class="w-full md:w-[768px] rounded-none md:!rounded-l-3xl"
        position="right"
        v-on:hide="closeSideMenu"
    >
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-lg sm:text-xl md:text-2xl">Menu</h3>


        </div>
      </template>

      <div>
        Cunt
      </div>
    </Drawer>
  </div>
</template>

<style lang="css" scoped>
</style>