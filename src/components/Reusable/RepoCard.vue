<script lang="ts" setup>

import {FolderGit, GitFork, Star} from "lucide-vue-next";
import {Tag} from "primevue";
import type {GithubRepository} from "../../types/github.ts";

const props = defineProps<{
  repository: GithubRepository
}>()

const {repository} = props;

</script>

<template>
  <div
      class="w-80 max-w-[90%] aspect-video flex-shrink-0 flex flex-col justify-between border border-stone-300
    dark:border-stone-600 rounded-lg p-3 sm:p-4">
    <a :href="repository.url" class="flex items-center gap-x-2" rel="noreferrer noopener nofollow"
       target="_blank">

      <FolderGit :size="16" class="flex-shrink-0"/>
      <h4 class="text-lg sm:text-xl font-heading underline line-clamp-1  text-green-800 dark:text-green-400">
        {{ repository.name }}</h4>


    </a>
    <p class="line-clamp-2">{{ repository.description ?? "No description available" }}</p>

    <div class="flex items-center gap-x-3 text-sm">
      <div class="flex items-center gap-x-2 text-stone-600 dark:text-stone-400">
        <Star :size="16"/>
        <span>{{ repository.stargazerCount }}</span></div>
      <div class="flex items-center gap-x-2 text-stone-600 dark:text-stone-400">
        <GitFork :size="16"/>
        <span>{{ repository.forkCount }}</span></div>
      <Tag
          :style="{ color: repository.primaryLanguage?.color || '#999', fontWeight: 'normal', border: `1px solid ${repository.primaryLanguage?.color || '#999'}` }"
          :value="(repository.primaryLanguage?.name?.length && repository.primaryLanguage?.name?.length > 10) ? repository.primaryLanguage?.name.slice(0,10) + '...' : repository.primaryLanguage?.name"
          class="ml-auto !text-xs !pointer-events-none border-none !bg-stone-50 dark:!bg-stone-900 !backdrop-opacity-50 !px-4 py-0 !rounded-full flex-shrink-0"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>

</style>