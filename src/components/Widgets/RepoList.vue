<script lang="ts" setup>
import {ChevronLeft, ChevronRight} from "lucide-vue-next";
import {Button} from "primevue";
import {useGithubStore} from "../../pinia/githubProfileStore.ts";
import {ref} from "vue";
import RepoCard from "../Reusable/RepoCard.vue";

const github = useGithubStore()
const reposContainer = ref<HTMLDivElement | null>(null);

function scrollRepos(direction: "left" | "right") {
  if (!reposContainer.value) return;
  const scrollAmount = 300;
  reposContainer.value.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
}
</script>

<template>
  <div v-if="github.loading">Loading GitHub Data...</div>
  <div v-else-if="github.error" class="text-red-500">{{ github.error }}</div>
  <div v-else-if="github.profileData"
       class="w-full h-full flex flex-col gap-y-3 p-3 sm:p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
    <div class="w-full flex flex-wrap items-center justify-between gap-x-5 gap-y-2 flex-shrink-0"><h2
        class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400 ">
      <span class="text-lime-500 dark:text-lime-400">{{
          github?.profileData?.viewer?.repositories?.nodes?.length
        }}</span> <span class="">Repositories</span></h2>
      <div class="flex items-center gap-x-2 font-content ml-auto">
        <!-- Scroll buttons -->
        <Button
            class="!border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500"
            rounded
            @click="scrollRepos('left')"
        >
          <ChevronLeft :size="16" class="text-stone-800"/>
        </Button>
        <Button
            class="!border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500"
            @click="scrollRepos('right')"
        >
          <ChevronRight :size="16"/>
        </Button>

        <RouterLink
            :to="'/dashboard/repos-list'"
            class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm flex-shrink-0"

        >
          View All
        </RouterLink>
      </div>
    </div>

    <div ref="reposContainer"
         class="w-full flex flex-row flex-nowrap gap-3 overflow-y-auto rounded-lg snap-x snap-mandatory">
      <RepoCard v-for="repository in github?.profileData?.viewer?.repositories?.nodes" :repository="repository"/>
    </div>
  </div>
</template>

<style lang="css" scoped>

</style>