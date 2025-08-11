<template>
  <div class="w-full h-full flex flex-col md:flex-row">
    <Toast class="!max-w-2xs"/>
    <div class="w-full md:w-[70px] h-[60px] md:h-full flex-shrink-0">
      <NavBar/>
    </div>
    <div class="h-full flex-grow-1 overflow-auto">
      <slot/>
    </div>


  </div>
  <SideMenu/>
  <FeedbackMenu/>
  <ConfirmDialog></ConfirmDialog>
</template>

<script lang="ts" setup>
import {Toast} from "primevue"
import ConfirmDialog from "primevue/confirmdialog"
import NavBar from "../components/NavBar/NavBar.vue";
import SideMenu from "../components/NavBar/SideMenu.vue";
import FeedbackMenu from "../components/NavBar/FeedbackMenu.vue";
</script>
