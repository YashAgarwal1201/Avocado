<script lang="ts" setup>
import {Building, Link, MapPin} from 'lucide-vue-next';
import BasicProfile from "../components/Widgets/BasicProfile.vue";
import BaseLayout from "../layout/BaseLayout.vue";
import RepoList from "../components/Widgets/RepoList.vue";

import {onMounted} from 'vue'
import {useGithubStore} from "../pinia/githubProfileStore.ts";
import OpenPRs from "../components/Widgets/OpenPRs.vue";
import NotificationsAlerts from "../components/Widgets/NotificationsAlerts.vue";

const github = useGithubStore()

onMounted(() => {
  github.fetchGithubData()
})
</script>

<template>
  <BaseLayout>
    <div class="w-full h-full p-4 sm:p-6 xl:p-8 flex flex-col gap-y-4 overflow-y-auto">
      <div class="w-full h-1/2 flex justify-center items-center">
        <BasicProfile/>
      </div>
      <div
          class="p-3 sm:p-4 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 flex flex-wrap flex-col md:flex-row items-start md:items-center gap-x-3">
        <div class="flex  items-center gap-x-2">
          <Building :size="16"/>
          <span class="text-stone-600 dark:text-stone-400">{{ github?.profileData?.viewer?.company ?? "N/A" }}</span>
        </div>

        <div class="flex items-center gap-x-2">
          <MapPin :size="16"/>
          <span class="text-stone-600 dark:text-stone-400">{{ github?.profileData?.viewer?.location ?? "N/A" }}</span>
        </div>

        <div class="flex items-center gap-x-2">
          <Link :size="16"/>
          <span class="text-stone-600 dark:text-stone-400">{{ github.profileData?.viewer?.websiteUrl ?? "N/A" }}</span>
        </div>
      </div>
      <div class="w-full flex flex-col gap-y-4">
        <div class="flex-grow-1 h-full flex justify-center items-center">
          <RepoList/>
        </div>

        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <OpenPRs/>
          <NotificationsAlerts/>
        </div>
      </div>


    </div>
  </BaseLayout>

</template>

<style lang="css" scoped>

</style>