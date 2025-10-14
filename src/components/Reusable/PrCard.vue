<script lang="ts" setup>

import {Clock, FolderGit, GitPullRequest} from "lucide-vue-next";
import type {GithubPullRequest} from "../../types/github.ts";


const props = defineProps<{
  pr: GithubPullRequest
}>()

const {pr} = props;
</script>

<template>
  <div

      class="rounded-lg border border-stone-300 dark:border-stone-600 p-3 md:p-4"
  >
    <div class="flex items-center gap-x-2">
      <GitPullRequest :size="16"/>
      <a
          :href="pr.url"
          class="text-base md:text-lg font-heading text-yellow-800 dark:text-yellow-400 line-clamp-1 underline"
          rel="noreferrer noopener nofollow"
          target="_blank"
      >
        {{ pr.title ?? "" }}
      </a>
    </div>

    <a
        :href="pr.repository?.url"
        class="text-base hover:underline flex items-center gap-x-2"
        rel="noreferrer noopener nofollow"
        target="_blank"
    >
      <FolderGit :size="16"/>
      {{ pr.repository?.name ?? "" }}
    </a>

    <p class="text-stone-600 dark:text-stone-400 text-base flex items-center gap-x-2">
      <Clock :size="16"/>
      {{ pr.createdAt ? new Date(pr.createdAt).toLocaleString() : "—" }}
    </p>
  </div>
</template>

<style lang="css" scoped>

</style>