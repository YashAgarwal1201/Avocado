<script lang="ts" setup>

import BasicProfile from "../components/Widgets/BasicProfile.vue";
import BaseLayout from "../layout/BaseLayout.vue";

import Button from "primevue/button"
</script>

<template>
  <BaseLayout>
    <div class="w-full h-full flex flex-col overflow-y-auto">
      <div class="w-full h-1/2 border-b flex justify-center items-center">
        <BasicProfile/>
      </div>
      <div class="w-full flex flex-col gap-y-3">
        <div class="flex-shrink-0 flex flex-row items-center gap-x-2 overflow-x-auto">
          <Button v-for="i in 5" :key="i"
                  class="flex-shrink-0 px-4 py-2 flex items-center justify-between gap-x-2 rounded-lg">{{ i }}
          </Button>
        </div>
        <div class="border flex-grow-1 h-full flex justify-center items-center"><span>Category content vvv</span></div>
      </div>


    </div>
  </BaseLayout>

</template>

<style lang="css" scoped>

</style>