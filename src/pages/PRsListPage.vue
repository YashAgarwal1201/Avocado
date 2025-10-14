<script lang="ts" setup>
import {Button, InputText, Select} from "primevue";
import {ArrowLeft} from "lucide-vue-next";
import BaseLayout from "../layout/BaseLayout.vue";
import {useGithubStore} from "../pinia/githubProfileStore.ts";
import {computed, ref} from "vue";
import PrCard from "../components/Reusable/PrCard.vue";

const github = useGithubStore();
const goBack = () => window.history.back();

// Filter + sort state
const searchQuery = ref("");
const selectedRepo = ref("All");
const selectedSort = ref("time_desc");

const repoOptions = computed(() => {
  const nodes = github.profileData?.viewer?.pullRequests?.nodes || [];
  const repos = new Set(nodes.map((pr) => pr.repository?.name).filter(Boolean));
  return ["All", ...Array.from(repos)];
});

const sortOptions = [
  {label: "Newest", value: "time_desc"},
  {label: "Oldest", value: "time_asc"},
  {label: "Repo A → Z", value: "repo_asc"},
  {label: "Repo Z → A", value: "repo_desc"},
];

const filteredPRs = computed(() => {
  const nodes = github.profileData?.viewer?.pullRequests?.nodes || [];

  const filtered = nodes.filter((pr) => {
    const q = searchQuery.value.toLowerCase();
    const title = (pr.title ?? "").toLowerCase();
    const repoName = (pr.repository?.name ?? "").toLowerCase();

    const matchesSearch = title.includes(q) || repoName.includes(q);
    const matchesRepo =
        selectedRepo.value === "All" || pr.repository?.name === selectedRepo.value;

    return matchesSearch && matchesRepo;
  });

  return filtered.slice().sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    const repoA = (a.repository?.name ?? "").toLowerCase();
    const repoB = (b.repository?.name ?? "").toLowerCase();

    switch (selectedSort.value) {
      case "time_desc":
        return timeB - timeA;
      case "time_asc":
        return timeA - timeB;
      case "repo_asc":
        return repoA.localeCompare(repoB);
      case "repo_desc":
        return repoB.localeCompare(repoA);
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
      <!-- Header -->
      <div class="flex flex-row flex-wrap-reverse sm:items-center justify-between gap-3">
        <h1 class="text-2xl sm:text-3xl font-heading text-green-800 dark:text-green-400 flex-wrap">
          <span class="text-lime-500 dark:text-lime-400 mr-2">{{ filteredPRs?.length }}</span>
          <span>Pull Requests</span>
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
              :href="github.profileData.viewer.url + '/pulls'"
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
            class="flex-grow-1 border border-stone-300 dark:border-stone-600 !bg-stone-100 dark:!bg-stone-800 px-4 py-2 !rounded-lg"
            placeholder="Search by title or repository name"
        />
        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Select
              v-model="selectedRepo"
              :options="repoOptions"
              class="flex-grow sm:flex-grow-0 w-auto !text-sm !rounded-lg border border-stone-300 dark:border-stone-600 !bg-stone-100 dark:!bg-stone-800 *:!text-lime-500 dark:*:!text-lime-400"
              placeholder="Filter by repository"
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

      <!-- PR list -->
      <div
          class="flex-grow-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 auto-rows-max mt-3 py-2">
        <PrCard v-for="pr in filteredPRs"
                :key="pr.id"
                :pr="pr"/>
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>
/* keep scoped styling here if needed */
</style>
