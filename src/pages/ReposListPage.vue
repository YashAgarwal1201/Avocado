<script lang="ts" setup>
import BaseLayout from "../layout/BaseLayout.vue";
import {computed, ref} from "vue";
import {ArrowLeft} from "lucide-vue-next";
import {Button, InputText, Select} from "primevue";

import {useGithubStore} from "../pinia/githubProfileStore.ts";
import RepoCard from "../components/Reusable/RepoCard.vue";

const github = useGithubStore();

// Go back
const goBack = () => window.history.back();

// Filter state
const searchQuery = ref("");
const selectedLanguage = ref("All");
const selectedSort = ref("stars");

// Sorting options
const sortOptions = [
  {label: "Stars", value: "stars"},
  {label: "Forks", value: "forks"},
  {label: "Name", value: "name"},
];

// Compute unique languages
const languages = computed(() => {
  const nodes = github.profileData?.viewer?.repositories?.nodes || [];
  const langs = nodes.map((r) => r.primaryLanguage?.name).filter(Boolean) as string[];
  return ["All", ...Array.from(new Set(langs))];
});

// Filtered & sorted repos
const filteredRepos = computed(() => {
  const nodes = github.profileData?.viewer?.repositories?.nodes || [];
  const filtered = nodes.filter((repo) => {
    const query = searchQuery.value.toLowerCase();
    const matchesSearch =
        repo.name.toLowerCase().includes(query) ||
        (repo.description?.toLowerCase().includes(query) ?? false);
    const matchesLanguage =
        selectedLanguage.value === "All" || repo.primaryLanguage?.name === selectedLanguage.value;
    return matchesSearch && matchesLanguage;
  });

  // Sorting
  return filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case "stars":
        return b.stargazerCount - a.stargazerCount;
      case "forks":
        return b.forkCount - a.forkCount;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
});
</script>

<template>
  <BaseLayout>
    <div v-if="github.loading" class="p-4 text-center">Loading GitHub Data...</div>
    <div v-else-if="github.error" class="p-4 text-red-500 text-center">{{ github.error }}</div>

    <div v-else-if="github.profileData" class="w-full h-full flex flex-col gap-y-3 p-3 sm:p-4">
      <!-- Header + Buttons -->
      <div class="flex flex-row flex-wrap-reverse sm:items-center justify-between gap-3">
        <h1 class="text-2xl sm:text-3xl font-heading text-green-800 dark:text-green-400 flex-wrap">
          <span class="text-lime-500 dark:text-lime-400 mr-2">{{ filteredRepos.length }}</span>
          <span>Repositories</span>
        </h1>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
              class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm flex-shrink-0"
              title="Go Back"
              @click="goBack"
          >
            <ArrowLeft :size="16"/>
            <span class="hidden sm:block">Go Back</span>
          </Button>

          <a
              :href="github.profileData.viewer.url + '?tab=repositories'"
              class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm flex-shrink-0"
              rel="noopener noreferrer nofollow"
              target="_blank"
              title="View on GitHub"
          >
            <span class="pi pi-github"/>
            <span class="hidden sm:block">View on GitHub</span>
          </a>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="flex flex-row flex-wrap gap-2 sm:gap-3 mt-3 items-center">
        <InputText
            v-model="searchQuery"
            class="flex-grow-1 flex-shrink-1 border border-stone-300 dark:border-stone-600 !bg-stone-100 dark:!bg-stone-800 px-4 py-2 !rounded-lg"
            placeholder="Search by name or description"
        />
        <div class="w-full sm:w-auto flex  items-center gap-2 sm:gap-3">
          <Select
              v-model="selectedLanguage"
              :options="languages"
              class="flex-grow sm:flex-grow-0 *:!text-lime-500 dark:*:!text-lime-400 w-auto !text-sm !rounded-lg border border-stone-300 dark:border-stone-600 !bg-stone-100 dark:!bg-stone-800"
              placeholder="Filter by language"
          />

          <Select
              v-model="selectedSort"
              :options="sortOptions"
              class="flex-grow sm:flex-grow-0 *:!text-lime-500 dark:*:!text-lime-400 w-auto !text-sm !rounded-lg border border-stone-300 dark:border-stone-600 !bg-stone-100 dark:!bg-stone-800"
              optionLabel="label"
              optionValue="value"
              placeholder="Sort by"
          /></div>

      </div>

      <!-- Repositories grid -->
      <div class="w-full flex flex-row flex-wrap gap-3 mt-3 overflow-y-auto rounded-lg py-2">
        <RepoCard
            v-for="repository in filteredRepos"
            :key="repository.id"
            :repository="repository"
        />
        <div v-if="filteredRepos.length === 0" class="text-stone-500 dark:text-stone-400 p-4">
          No repositories found.
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>

</style>
