<script lang="ts" setup>
import {ChevronLeft, ChevronRight, FolderGit, GitFork, Star} from "lucide-vue-next";
import {Button, Tag} from "primevue";
import {useGithubStore} from "../../pinia/githubProfileStore.ts";
import {ref} from "vue";

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
    <div class="w-full flex items-center justify-between gap-x-5 flex-shrink-0"><h2
        class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400">Repositories</h2>
      <div class="flex items-center gap-x-2">
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

        <!-- View all button -->
        <a
            :href="github.profileData.viewer.url + '?tab=repositories'"
            class="p-button !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm"
            rel="noopener noreferrer nofollow"
            target="_blank"
        >
          View All
        </a>
      </div>
    </div>

    <div ref="reposContainer" class="w-full flex flex-row flex-nowrap gap-3 overflow-y-auto rounded-lg">
      <div v-for="repository in github?.profileData?.viewer?.repositories?.nodes" :key="repository.id"
           class="w-2xs aspect-video flex-shrink-0 flex flex-col justify-between border border-stone-300 dark:border-stone-600 rounded-lg p-3 sm:p-4">
        <a :href="repository.url" class="flex items-center gap-x-2" rel="noreferrer noopener nofollow" target="_blank">
          <!--        <img :src="repository." />-->
          <FolderGit :size="16"/>
          <h4 class="text-lg sm:text-xl font-heading underline line-clamp-1  text-green-800 dark:text-green-400">
            {{ repository.name }}</h4>

          <Tag
              :style="{ color: repository.primaryLanguage?.color || '#999', fontWeight: 'normal', border: `1px solid ${repository.primaryLanguage?.color || '#999'}` }"
              :value="repository.primaryLanguage?.name"
              class="ml-auto !text-xs pointer-events-none border-none !bg-stone-50 dark:!bg-stone-900 !backdrop-opacity-50 !px-4 py-0 !rounded-full"
          />
        </a>
        <p class="line-clamp-2">{{ repository.description ?? "No description available" }}</p>

        <div class="flex items-center gap-x-3 text-sm">
          <div class="flex items-center gap-x-2 text-stone-600 dark:text-stone-400">
            <Star :size="16"/>
            <span>{{ repository.stargazerCount }}</span></div>
          <div class="flex items-center gap-x-2 text-stone-600 dark:text-stone-400">
            <GitFork :size="16"/>
            <span>{{ repository.forkCount }}</span></div>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>

</style>