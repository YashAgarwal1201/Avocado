<template>
  <div v-if="github.loading">Loading GitHub Data...</div>
  <div v-else-if="github.error" class="text-red-500">{{ github.error }}</div>
  <div v-else-if="github.profileData" class="w-full h-full flex flex-col sm:flex-row items-center gap-4">
    <div
        class="w-full max-w-3xs aspect-square border border-stone-300 dark:border-stone-600 rounded-xl overflow-hidden">
      <img :src="github.profileData.viewer.avatarUrl" alt="Avatar" class="w-full h-full object-cover"/>
    </div>

    <div class="w-full flex flex-col gap-y-0 justify-center items-center md:items-start ">
      <h1 v-if="github.profileData.viewer.name"
          class="text-2xl sm:text-3xl font-heading text-green-800 dark:text-green-400">
        {{ github.profileData.viewer.name }}</h1>
      <a v-if="github.profileData.viewer.login" :href="github.profileData.viewer.url"
         class="text-xl sm:text-2xl underline w-fit"
         rel="noreferrer noopener nofollow" target="_blank">{{
          github.profileData.viewer.login ?? ""
        }}</a>
      <p class="mt-4 md:mt-3 line-clamp-3">{{ github.profileData.viewer.bio ?? "No bio available" }}</p>

      <div class="flex items-center gap-x-2 text-stone-600 dark:text-stone-400">
        <div class="flex items-center gap-x-2 text-stone-600 dark:text-stone-400">
          <span>Followers: </span><span>{{ github.profileData.viewer.followers?.totalCount ?? 0 }}</span></div>
        <Dot :size="16"/>
        <div class="flex items-center gap-x-2">
          <span>Following: </span><span>{{ github.profileData.viewer.following?.totalCount ?? 0 }}</span></div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>


<script lang="ts" setup>
// import {onMounted} from 'vue'
import {Dot} from "lucide-vue-next"
import {useGithubStore} from "../../pinia/githubProfileStore.ts";

const github = useGithubStore()

// onMounted(() => {
//   github.fetchGithubData()
// })
</script>

