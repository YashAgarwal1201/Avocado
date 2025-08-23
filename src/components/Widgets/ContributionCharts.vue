<template>
  <div class="p-3 sm:p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
    <div class="flex items-center justify-between">
      <h2 class="text-xl sm:text-2xl font-heading text-green-800 dark:text-green-400 flex-shrink-0 flex items-center gap-x-2">
        <span class="text-lime-500 dark:text-lime-400">
          {{ totalContributions.toLocaleString() }}
        </span> contributions in the last year
      </h2>
    </div>

    <div v-if="loading" class="animate-pulse">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">Failed to load contribution data</p>
    </div>

    <div v-else-if="heatmapData.length > 0">
      <div class="contribution-section">
        <div class="heatmap-container">
          <CalendarHeatmap
              :end-date="endDate"
              :max="20"
              :range-color="limeColorRange"
              :round="2"
              :tooltip="true"
              :values="heatmapData"
              class="w-full"
              tooltip-unit="contributions"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-stone-600 dark:text-stone-400">No contribution data available</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted} from 'vue'
import {CalendarHeatmap} from 'vue3-calendar-heatmap'
import {useGithubStore} from "../../pinia/githubProfileStore.ts";

const githubStore = useGithubStore()

// Tailwind lime color palette for the heatmap
const limeColorRange = [
  '#f3f4f6', // gray-100 for no contributions
  '#d9f99d', // lime-200
  '#a3e635', // lime-400
  '#65a30d', // lime-600
  '#365314'  // lime-800
]

const loading = computed(() => githubStore.loading)
const error = computed(() => githubStore.error)
const profileData = computed(() => githubStore.profileData)

const totalContributions = computed(() => {
  return profileData.value?.viewer?.contributionsCollection?.contributionCalendar?.totalContributions || 0
})

const heatmapData = computed(() => {
  const weeks = profileData.value?.viewer?.contributionsCollection?.contributionCalendar?.weeks
  if (!weeks) return []

  const data: Array<{ date: string; count: number }> = []

  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      data.push({
        date: day.date,
        count: day.contributionCount
      })
    })
  })

  return data
})

const endDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

onMounted(() => {
  if (!profileData.value) {
    githubStore.fetchGithubData()
  }
})
</script>

<style scoped>
@reference "tailwindcss";

.contribution-section {
  @apply mt-4 w-full overflow-x-auto;
}

.heatmap-container {
  @apply w-full;
  min-width: 700px;
}

/* Simple fixed sizing for the calendar heatmap */
:deep(.vch__container) {
  width: 100% !important;
  max-width: none !important;
}

:deep(.vch__day__square) {
  width: 10px !important;
  height: 10px !important;
}

:deep(.vch__month__label) {
  font-size: 10px !important;
  fill: #78716c !important; /* stone-500 */
}

:deep(.vch__day__label) {
  font-size: 9px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  fill: #78716c !important; /* stone-500 */
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :deep(.vch__month__label),
  :deep(.vch__day__label) {
    fill: #a8a29e !important; /* stone-400 */
  }
}
</style>
