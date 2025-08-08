<template>
  <div
      class="w-full h-full flex flex-row md:flex-col items-center gap-1 text-white p-1"
  >
    <RouterLink
        class="w-auto md:w-full h-full md:h-auto p-button aspect-square flex justify-center items-center !rounded-2xl"
        to="/"
    >
      <Home :size="16"/>
    </RouterLink>

    <Button
        class="w-auto md:w-full h-full md:h-auto aspect-square flex justify-center items-center !rounded-2xl"
    >
      <MessageCircle :size="16"/>
    </Button>

    <Button
        class="w-auto md:w-full h-full md:h-auto aspect-square flex justify-center items-center !rounded-2xl ml-auto md:ml-0 mt-0 md:mt-auto"
    >
      <Menu :size="16"/>
    </Button>
  </div>
</template>

<script lang="ts" setup>
import {Home, Menu, MessageCircle} from "lucide-vue-next";
import {Button} from "primevue";

// import { ref } from 'vue';
</script>

<style lang="css" scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
