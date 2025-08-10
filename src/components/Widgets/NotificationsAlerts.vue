<script lang="ts" setup>
import {useGithubStore} from "../../pinia/githubProfileStore.ts";
import {onMounted} from "vue";

const github = useGithubStore()

onMounted(async () => {
  await github.loadNotifications();
})
</script>

<template>
  <div v-if="github.loadingNotifications">Loading GitHub Data...</div>

  <div v-else-if="github.profileData"
       class="w-full h-64 flex flex-col gap-y-3 p-3 sm:p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
    <h2 class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400  flex-shrink-0">Notifications</h2>
    <div v-if="github.notificationsError" class="text-red-500 flex-grow-1 overflow-y-auto flex flex-col gap-y-3">
      {{ github.notificationsError }}<br/> Check console for more information.
    </div>
    <div v-else-if="github.notifications?.length > 0" class="flex-grow-1 overflow-y-auto flex flex-col gap-y-3">
      <div v-for="notification in github.notifications" :key="notification?.id"
           class="rounded-lg border border-stone-300 dark:border-stone-600 p-3 md:p-4">
        <div class="flex items-center gap-x-2">
          <!--                <GitPullRequest :size="16"/>-->
          <h4 class="text-base md:text-lg font-heading text-yellow-800 dark:text-yellow-400 line-clamp-1 underline">
            <a :href="notification?.url ?? ''" rel="noreferrer noopener nofollow"
               target="_blank">{{ notification?.title ?? "" }}</a></h4>
        </div>
        <p class="text-base">{{ notification?.name ?? "" }}</p>
        <p class="text-stone-600 dark:text-stone-400 text-base">{{ notification?.createdAt ?? "" }}</p>
      </div>


    </div>

    <div v-else class="flex-grow-1 overflow-y-auto flex flex-col gap-y-3"><p
        class="m-auto text-stone-600 dark:text-stone-400 text-base">No notifications found</p></div>
  </div>
</template>

<style lang="css" scoped>

</style>