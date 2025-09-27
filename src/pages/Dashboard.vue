<script lang="ts" setup>
import {AlertCircle, Building, Link, Loader2, MapPin, Settings} from 'lucide-vue-next';
import BasicProfile from "../components/Widgets/BasicProfile.vue";
import BaseLayout from "../layout/BaseLayout.vue";
import RepoList from "../components/Widgets/RepoList.vue";
import OpenPRs from "../components/Widgets/OpenPRs.vue";
import NotificationsAlerts from "../components/Widgets/NotificationsAlerts.vue";

import {computed} from 'vue';
import {useGithubStore} from "../pinia/githubProfileStore.ts";
import {useWidgetStore} from "../pinia/widgetsStore.ts";

// PrimeVue components
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Message from 'primevue/message';
import ContributionCharts from "../components/Widgets/ContributionCharts.vue";

const github = useGithubStore();
const widgets = useWidgetStore();

// Computed properties for better organization
const hasProfile = computed(() => widgets.selectedWidgets.includes('profile'));
const hasRepos = computed(() => widgets.selectedWidgets.includes('repos'));
const hasPRs = computed(() => widgets.selectedWidgets.includes('prs'));
const hasNotifications = computed(() => widgets.selectedWidgets.includes('notifications'));
const hasContributions = computed(() => widgets.selectedWidgets.includes('contributions'));

// Grid layout logic
const gridCols = computed(() => {
  const activeWidgets = [hasPRs.value, hasNotifications.value].filter(Boolean).length;
  if (activeWidgets === 0) return '';
  if (activeWidgets === 1) return 'grid-cols-1';
  return 'grid-cols-1 lg:grid-cols-2';
});

const hasAnyWidgets = computed(() =>
    hasProfile.value || hasRepos.value || hasPRs.value || hasNotifications.value
);

// onMounted(() => {
//   github.fetchGithubData();
// });
</script>

<template>
  <BaseLayout>
    <div class="w-full h-full p-4 sm:p-6 xl:p-8 flex flex-col gap-y-6 overflow-y-auto">

      <!-- Header Section -->
      <!--      <div class="flex justify-between items-center">-->
      <!--        <div>-->
      <!--          <h1 class="text-2xl sm:text-3xl font-heading text-green-800 dark:text-green-400">-->
      <!--            GitHub Dashboard-->
      <!--          </h1>-->
      <!--          <p class="text-stone-600 dark:text-stone-400 mt-1">-->
      <!--            Welcome back! Here's your GitHub overview-->
      <!--          </p>-->
      <!--        </div>-->

      <!--      </div>-->

      <!-- No Widgets Selected State -->
      <div v-if="!hasAnyWidgets" class="flex-1 flex flex-col items-center justify-center text-center py-12">
        <Settings :size="64" class="text-stone-400 mb-4"/>
        <h2 class="text-xl font-semibold text-stone-700 dark:text-stone-300 mb-2">
          No Widgets Selected
        </h2>
        <p class="text-stone-500 dark:text-stone-400 mb-6 max-w-md">
          Customize your dashboard by selecting which widgets you'd like to see.
        </p>
        <router-link to="/settings">
          <Button icon="pi pi-cog" label="Customize Dashboard"/>
        </router-link>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="flex flex-col gap-y-6">

        <!-- Error State -->
        <Message
            v-if="github.error"
            :closable="false"
            class="mb-4"
            severity="error"
        >
          <div class="flex items-center gap-2">
            <AlertCircle :size="16"/>
            <span>{{ github.error }}</span>
          </div>
        </Message>

        <!-- Loading State -->
        <div v-if="github.loading" class="space-y-6">
          <div class="flex justify-center">
            <Loader2 :size="32" class="animate-spin text-green-600"/>
          </div>
          <Skeleton height="200px"/>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height="300px"/>
            <Skeleton height="300px"/>
          </div>
        </div>

        <!-- Profile Section -->
        <section v-else-if="hasProfile" class="space-y-4">
          <div class="w-full flex justify-center">
            <BasicProfile/>
          </div>

          <!-- Profile Details Card -->
          <div class="p-4 sm:p-6 rounded-xl border border-stone-200 dark:border-stone-700
                      bg-stone-100 dark:bg-stone-800">
            <div class="flex flex-wrap gap-4 md:gap-6">
              <div class="flex items-center gap-2 min-w-0">
                <Building :size="16" class="text-green-600 dark:text-green-400 flex-shrink-0"/>
                <span class="text-stone-700 dark:text-stone-300 truncate">
                  {{ github?.profileData?.viewer?.company || "Not specified" }}
                </span>
              </div>

              <div class="flex items-center gap-2 min-w-0">
                <MapPin :size="16" class="text-green-600 dark:text-green-400 flex-shrink-0"/>
                <span class="text-stone-700 dark:text-stone-300 truncate">
                  {{ github?.profileData?.viewer?.location || "Not specified" }}
                </span>
              </div>

              <div class="flex items-center gap-2 min-w-0">
                <Link :size="16" class="flex-shrink-0"/>
                <a
                    v-if="github.profileData?.viewer?.websiteUrl"
                    :href="github.profileData.viewer.websiteUrl"
                    class="
                         text-stone-700 dark:text-stone-300 truncate transition-colors duration-200"
                    target="_blank"
                >
                  {{ github.profileData.viewer.websiteUrl }}
                </a>
                <span v-else class="text-stone-700 dark:text-stone-300">
                  Not specified
                </span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="hasContributions">
          <ContributionCharts/>
        </section>

        <!-- Widgets Grid -->
        <section class="space-y-6">
          <!-- Repository List -->
          <div v-if="hasRepos" class="w-full">
            <RepoList/>
          </div>

          <!-- Bottom Grid: PRs and Notifications -->
          <div
              v-if="hasPRs || hasNotifications"
              :class="gridCols"
              class="grid gap-6"
          >
            <div v-if="hasPRs" class="min-h-0">
              <OpenPRs/>
            </div>

            <div v-if="hasNotifications" class="min-h-0">
              <NotificationsAlerts/>
            </div>
          </div>
        </section>
      </div>

      <!-- Quick Actions (Mobile) -->
      <div class="sm:hidden fixed bottom-4 right-4">
        <router-link to="/settings">
          <Button
              class="shadow-lg"
              icon="pi pi-cog"
              rounded
              severity="secondary"
              size="large"
          />
        </router-link>
      </div>
    </div>
  </BaseLayout>
</template>

<!--<style scoped>-->
<!--:deep(.overflow-y-auto) {-->
<!--  scrollbar-width: thin;-->
<!--  scrollbar-color: theme('colors.stone.300') theme('colors.stone.100');-->
<!--}-->

<!--:deep(.overflow-y-auto::-webkit-scrollbar) {-->
<!--  width: 6px;-->
<!--}-->

<!--:deep(.overflow-y-auto::-webkit-scrollbar-track) {-->
<!--  background: theme('colors.stone.100');-->
<!--  border-radius: 3px;-->
<!--}-->

<!--:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {-->
<!--  background: theme('colors.stone.300');-->
<!--  border-radius: 3px;-->
<!--}-->

<!--:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {-->
<!--  background: theme('colors.stone.400');-->
<!--}-->

<!--/* Dark mode scrollbar */-->
<!--:deep(.dark .overflow-y-auto) {-->
<!--  scrollbar-color: theme('colors.stone.600') theme('colors.stone.800');-->
<!--}-->

<!--:deep(.dark .overflow-y-auto::-webkit-scrollbar-track) {-->
<!--  background: theme('colors.stone.800');-->
<!--}-->

<!--:deep(.dark .overflow-y-auto::-webkit-scrollbar-thumb) {-->
<!--  background: theme('colors.stone.600');-->
<!--}-->

<!--:deep(.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover) {-->
<!--  background: theme('colors.stone.500');-->
<!--}-->
<!--</style>-->
