<script lang="ts" setup>

import BaseLayout from "../layout/BaseLayout.vue";
import {ref} from "vue";
import {useGithubStore} from "../pinia/githubProfileStore.ts";
import RepoCard from "../components/Reusable/RepoCard.vue";

const github = useGithubStore()
const reposContainer = ref<HTMLDivElement | null>(null);
</script>

<template>
  <BaseLayout>

    <div v-if="github.loading">Loading GitHub Data...</div>
    <div v-else-if="github.error" class="text-red-500">{{ github.error }}</div>
    <div v-else-if="github.profileData"
         class="w-full h-full flex flex-col gap-y-3 p-3 sm:p-4">
      <div class="w-full flex flex-wrap items-center justify-between gap-x-5 gap-y-2 flex-shrink-0"><h2
          class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400 ">
      <span class="text-lime-500 dark:text-lime-400">{{
          github?.profileData?.viewer?.repositories?.nodes?.length
        }}</span> <span class="">Repositories</span></h2>
        <div class="flex items-center gap-x-2 font-content ml-auto">

          <!-- View all button -->
          <a
              :href="github.profileData.viewer.url + '?tab=repositories'"
              class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm flex-shrink-0"
              rel="noopener noreferrer nofollow"
              target="_blank"
          >
            View in Github
          </a>
        </div>
      </div>

      <div ref="reposContainer" class="w-full flex flex-row flex-wrap gap-3 overflow-y-auto rounded-lg">
        <RepoCard v-for="repository in github?.profileData?.viewer?.repositories?.nodes" :repository="repository"/>
      </div>
    </div>
  </BaseLayout>
</template>

<style lang="css" scoped>

</style>