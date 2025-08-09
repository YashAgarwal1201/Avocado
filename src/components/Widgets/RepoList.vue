<script lang="ts" setup>
import {FolderGit, GitFork, Star} from "lucide-vue-next";
import {Tag} from "primevue";
import {useGithubStore} from "../../pinia/githubProfileStore.ts";

const github = useGithubStore()
</script>

<template>
  <div v-if="github.loading">Loading GitHub Data...</div>
  <div v-else-if="github.error" class="text-red-500">{{ github.error }}</div>
  <div v-else-if="github.profileData"
       class="w-full h-full flex flex-col gap-y-3 p-3 sm:p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
    <h2 class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400">Repositories</h2>
    <div class="w-full flex flex-row flex-nowrap gap-3 overflow-y-auto rounded-lg">
      <div v-for="repository in github?.profileData?.viewer?.repositories?.nodes" :key="repository.id"
           class="w-2xs aspect-video flex-shrink-0 flex flex-col justify-between border border-stone-300 dark:border-stone-600 rounded-lg p-3 sm:p-4">
        <a :href="repository.url" class="flex items-center gap-x-2" rel="noreferrer noopener nofollow" target="_blank">
          <!--        <img :src="repository." />-->
          <FolderGit :size="16"/>
          <h4 class="text-lg sm:text-xl font-heading underline line-clamp-1  text-green-800 dark:text-green-400">
            {{ repository.name }}</h4>

          <Tag
              :style="{ backgroundColor: repository.primaryLanguage?.color || '#999', color: 'white' }"
              :value="repository.primaryLanguage?.name"
              class="ml-auto !text-xs pointer-events-none border-none !backdrop-opacity-50 !px-4 py-0 !rounded-full"
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