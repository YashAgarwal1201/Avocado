<template>
  <div
    class="w-full h-full grid grid-cols-3 md:flex md:flex-col justify-center items-center gap-3 text-white p-1"
  >
    <RouterLink
      v-for="item in navOptions"
      :key="item.route"
      :to="item.route"
      :title="item.title"
      :aria-label="item.ariaLabel"
      class="flex flex-col justify-center items-center nav-item group group-[&.nav-active]:pointer-events-none"
      active-class="nav-active"
    >
      <span
        class="rounded-full py-1 px-3 nav-bg group-[&.nav-active]:bg-yellow-600! group-[&.nav-active]:dark:bg-yellow-500! transition-all duration-200"
      >
        <component
          :is="item.icon"
          :size="16"
          class="transition-colors duration-200 group-[&.nav-active]:fill-white group-[&.nav-active]:text-white"
        />
      </span>
      <span
        class="truncate line-clamp-1 text-ellipsis text-xs font-medium mt-1 transition-all duration-200 group-[&.nav-active]:text-yellow-600! group-[&.nav-active]:dark:text-yellow-500! group-[&.nav-active]:font-bold"
      >
        {{ item.label }}
      </span>
    </RouterLink>

    <button
      class="flex flex-col justify-center items-center nav-item group group-[&.nav-active]:pointer-events-none bg-transparent!"
      active-class="nav-active"
      @click="() => navbarStore.openFeedbackMenu()"
    >
      <span
        class="rounded-full py-1 px-3 nav-bg transition-all duration-200"
        :class="
          navbarStore.isFeedbackMenuOpen
            ? 'bg-yellow-600! dark:bg-yellow-500!'
            : ''
        "
      >
        <MessageCircle
          :size="16"
          class="transition-colors duration-200"
          :class="navbarStore.isFeedbackMenuOpen ? 'fill-white text-white' : ''"
        />
      </span>
      <span
        class="text-xs mt-1"
        :class="
          navbarStore.isFeedbackMenuOpen
            ? 'text-yellow-600! dark:text-yellow-500! font-bold'
            : ''
        "
      >
        Feedback
      </span>
    </button>

    <button
      class="flex flex-col justify-center items-center nav-item group group-[&.nav-active]:pointer-events-none bg-transparent!"
      active-class="nav-active"
      @click="() => navbarStore.openSideMenu()"
    >
      <span
        class="rounded-full py-1 px-3 nav-bg transition-all duration-200"
        :class="
          navbarStore.isSideMenuOpen ? 'bg-yellow-600! dark:bg-yellow-500!' : ''
        "
      >
        <Menu
          :size="16"
          class="transition-colors duration-200"
          :class="navbarStore.isSideMenuOpen ? 'fill-white text-white' : ''"
        />
      </span>
      <span
        class="text-xs mt-1"
        :class="
          navbarStore.isSideMenuOpen
            ? 'text-yellow-600! dark:text-yellow-500! font-bold'
            : ''
        "
      >
        Menu
      </span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Home, Menu, MessageCircle } from "lucide-vue-next";
import { useNavbarStore } from "../../pinia/navbarStore.ts";

const navbarStore = useNavbarStore();

const navOptions = [
  {
    route: "/",
    title: "Go to home page",
    ariaLabel: "Home page",
    label: "Home",
    icon: Home,
  },
];
</script>

<style lang="css" scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
