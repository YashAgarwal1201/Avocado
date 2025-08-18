<script lang="ts" setup>
import {Bell, Clock, Dot, FolderGit} from "lucide-vue-next"
import {useGithubStore} from "../../pinia/githubProfileStore.ts";
import {onMounted, toRaw} from "vue";

const github = useGithubStore()

onMounted(async () => {
  await github.loadNotifications();
})

</script>

<template>
  <div v-if="github.loadingNotifications">Loading GitHub Data...</div>

  <div v-else-if="github.profileData"
       class="w-full h-64 flex flex-col gap-y-3 p-3 sm:p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
    <div class="flex items-center justify-between"><h2
        class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400  flex-shrink-0 flex items-center gap-x-2"> <span
        class="text-lime-500 dark:text-lime-400">{{
        github.notifications?.length
      }}</span> Notifications</h2>  <a
        :href="github.profileData.viewer.url"
        class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm"
        rel="noopener noreferrer nofollow"
        target="_blank"
    >
      View All
    </a></div>
    <div v-if="github.notificationsError" class="text-red-500 flex-grow-1 overflow-y-auto flex flex-col gap-y-3">
      {{ github.notificationsError }}<br/> Check console for more information.
    </div>
    <div v-else-if="github.notifications?.length > 0" class="flex-grow-1 overflow-y-auto flex flex-col gap-y-3">
      <div v-for="notification in toRaw(github.notifications)" :key="notification?.id"
           class="rounded-lg border border-stone-300 dark:border-stone-600 p-3 md:p-4">


        <div class="flex items-center gap-x-2">
          <Bell :size="16" class="flex-shrink-0"/>

          <a :href="notification?.url"
             class="text-base md:text-lg font-heading text-yellow-800 dark:text-yellow-400 truncate underline flex items-center gap-x-1"
             rel="noreferrer noopener nofollow"
             target="_blank">{{ notification?.reason }}
            <Dot :size="16" class="flex-shrink-0"/>
            {{
              notification?.subject?.title ?? ""
            }}</a>
        </div>
        <a :href="notification?.repository?.html_url" class="text-base hover:underline flex items-center gap-x-2"
           rel="noreferrer noopener nofollow"
           target="_blank">
          <FolderGit :size="16"/>
          {{ notification?.repository?.name ?? "" }}
        </a>
        <p class="text-stone-600 dark:text-stone-400 text-base flex items-center gap-x-2">
          <Clock :size="16"/>
          {{ notification?.updated_at ?? "" }}
        </p>
      </div>


    </div>

    <div v-else class="flex-grow-1 overflow-y-auto flex flex-col gap-y-3"><p
        class="m-auto text-stone-600 dark:text-stone-400 text-base">No notifications found</p></div>
  </div>
</template>

<style lang="css" scoped>

</style>