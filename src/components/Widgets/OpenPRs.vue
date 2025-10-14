<script lang="ts" setup>
import {useGithubStore} from "../../pinia/githubProfileStore.ts";
import PrCard from "../Reusable/PrCard.vue";

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
      }}</span>Open PRs</h2>
      <RouterLink
          :to="'/dashboard/prs-list'"
          class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm"

      >
        View All
      </RouterLink>
    </div>
    <div class="flex-grow-1 overflow-y-auto flex flex-col gap-y-3">
      <PrCard v-for="pr in github?.profileData?.viewer?.pullRequests?.nodes?.slice(0,10)"
              :key="pr.id"
              :pr="pr"/>
    </div>
  </div>
</template>

<style lang="css" scoped>

</style>