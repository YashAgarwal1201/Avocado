<template>
  <div class="w-full h-full flex flex-col sm:flex-row items-center gap-x-4">
    <div class="aspect-square border rounded-xl">
      <span>Profile Image</span>
    </div>

    <div class="flex justify-center items-center border rounded-xl">
      <span>Profile Details</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const feature = ref();
</script>

<style lang="css" scoped></style>
