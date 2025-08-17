<script lang="ts" setup>
import {Clock, FolderGit, GitPullRequest} from "lucide-vue-next"
import {useGithubStore} from "../../pinia/githubProfileStore.ts";

const github = useGithubStore()
</script>

<template>
  <div v-if="github.loading">Loading GitHub Data...</div>
  <div v-else-if="github.error" class="text-red-500">{{ github.error }}</div>
  <div v-else-if="github.profileData"
       class="w-full h-64 flex flex-col gap-y-3 p-3 sm:p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
    <div class="flex items-center justify-between"><h2
        class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400  flex-shrink-0 flex items-center gap-x-2"> <span
        class="text-lime-500 dark:text-lime-400">{{
        github?.profileData?.viewer?.pullRequests?.nodes?.length
      }}</span>Open PRs</h2>  <a
        :href="github.profileData.viewer.url + '\\pulls'"
        class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm"
        rel="noopener noreferrer nofollow"
        target="_blank"
    >
      View All
    </a></div>
    <div class="flex-grow-1 overflow-y-auto flex flex-col gap-y-3">
      <div v-for="pr in github?.profileData?.viewer?.pullRequests?.nodes" :key="pr.id"
           class="rounded-lg border border-stone-300 dark:border-stone-600 p-3 md:p-4">
        <div class="flex items-center gap-x-2">
          <GitPullRequest :size="16"/>

          <a :href="pr.url"
             class="text-base md:text-lg font-heading text-yellow-800 dark:text-yellow-400 line-clamp-1 underline"
             rel="noreferrer noopener nofollow"
             target="_blank">{{
              pr.title ?? ""
            }}</a>
        </div>


        <a :href="pr.repository.url" class="text-base hover:underline flex items-center gap-x-2"
           rel="noreferrer noopener nofollow"
           target="_blank">
          <FolderGit :size="16"/>
          {{ pr.repository.name ?? "" }}
        </a>
        <p class="text-stone-600 dark:text-stone-400 text-base flex items-center gap-x-2">
          <Clock :size="16"/>
          {{ pr.createdAt }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>

</style>