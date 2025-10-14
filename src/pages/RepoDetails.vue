<script lang="ts" setup>
import {computed, onMounted, watch} from "vue";
import {useRoute} from "vue-router";
import {useGithubStore} from "../pinia/githubProfileStore.ts";
import BaseLayout from "../layout/BaseLayout.vue";
import {Button} from "primevue";
import {Activity, ArrowLeft, Clock, Eye, FileCode2, GitFork, GitPullRequest, Star} from "lucide-vue-next";

const route = useRoute();
const github = useGithubStore();

const repoName = computed(() => route.params.repoName as string);
// const owner = computed(() => github.profileData?.viewer?.login);

const goBack = () => window.history.back();

// Get top contributors from commit history
const topContributors = computed(() => {
  if (!github.selectedRepo?.defaultBranchRef?.target?.history?.edges) return [];

  const commits = github.selectedRepo.defaultBranchRef.target.history.edges;
  const contributorMap = new Map();

  commits?.forEach(({node}: { node: any }) => {
    const login = node.author?.user?.login || node.author?.email;
    const avatarUrl = node.author?.user?.avatarUrl;
    const name = node.author?.name || login;

    if (login) {
      if (!contributorMap.has(login)) {
        contributorMap.set(login, {
          login,
          name,
          avatarUrl,
          count: 0
        });
      }
      contributorMap.get(login).count++;
    }
  });

  return Array.from(contributorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
});

// Calculate language percentages
const languagePercentages = computed(() => {
  if (!github.selectedRepo?.languages?.edges?.length) return [];

  const totalSize = github.selectedRepo.languages.totalSize || 1;

  return github.selectedRepo.languages.edges.map(({size, node}: { size: any, node: any }) => ({
    name: node.name,
    color: node.color,
    percentage: ((size / totalSize) * 100).toFixed(1)
  }));
});

async function loadRepoDetails() {
  if (!github.profileData) {
    if (github.loading) {
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!github.loading) {
            clearInterval(interval);
            resolve(null);
          }
        }, 100);
      });
    } else if (github.token) {
      await github.fetchGithubData();
    } else {
      github.error = 'No GitHub token found. Please configure your token.';
      return;
    }
  }

  const currentOwner = github.profileData?.viewer?.login;
  if (!currentOwner || !repoName.value) {
    console.error('Missing owner or repo name');
    return;
  }

  await github.fetchRepositoryDetails(currentOwner, repoName.value);
}

onMounted(async () => {
  await loadRepoDetails();
});

watch(
    () => route.params.repoName,
    async (newRepoName, oldRepoName) => {
      if (newRepoName && newRepoName !== oldRepoName) {
        await loadRepoDetails();
      }
    }
);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
}
</script>

<template>
  <BaseLayout>
    <!-- Loading state -->
    <div v-if="github.loadingRepo || github.loading"
         class="w-full h-full flex items-center justify-center flex-col gap-y-4 p-4 text-center">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
        <p>Loading repository details...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="github.repoError || github.error" class="p-4 text-red-500 text-center">
      {{ github.repoError || github.error }}
    </div>

    <!-- Repo details content - TWO COLUMN LAYOUT -->
    <div v-else-if="github.selectedRepo" class="w-full h-full p-3 sm:p-4">
      <!-- Header with Title and Buttons -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 class="text-2xl sm:text-3xl font-heading text-green-800 dark:text-green-400">
          {{ github.selectedRepo.name }}
        </h1>

        <div class="flex items-center gap-2">
          <Button
              class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm"
              title="Go Back"
              @click="goBack"
          >
            <ArrowLeft :size="16"/>
            <span class="hidden sm:inline ml-1">Go Back</span>
          </Button>

          <a
              :href="github.selectedRepo.url"
              class="p-button h-8 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-sm flex items-center gap-1"
              rel="noopener noreferrer nofollow"
              target="_blank"
              title="View on GitHub"
          >
            <span class="pi pi-github"/>
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <a
            v-if="github.selectedRepo.homepageUrl?.length > 0"
            :href="github.selectedRepo.homepageUrl ?? '' "
            class="px-4 py-2 bg-stone-800 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 flex items-center gap-2 text-sm"
            rel="noopener noreferrer nofollow"
            target="_blank"
        >
          <span class="pi pi-globe"/>
          View Project
        </a>

        <a
            :href="github.selectedRepo.url"
            class="px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2 text-sm"
            rel="noopener noreferrer nofollow"
            target="_blank"
        >
          <span class="pi pi-github"/>
          GitHub
        </a>

        <!--        <button-->
        <!--            class="px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2 text-sm"-->
        <!--            disabled-->
        <!--        >-->
        <!--          <GitFork :size="16"/>-->
        <!--          Branches-->
        <!--        </button>-->
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- LEFT COLUMN - Main Content (2/3 width on large screens) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- Description -->
          <div class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
            <h3 class="text-lg font-heading mb-2 text-stone-800 dark:text-stone-200">Description</h3>
            <p class="text-stone-600 dark:text-stone-400">
              {{ github.selectedRepo.description || 'No description provided' }}
            </p>
          </div>

          <!-- Open Pull Requests -->
          <div class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-heading text-stone-800 dark:text-stone-200">Open PRs</h3>
              <a
                  v-if="github.selectedRepo.url"
                  :href="github.selectedRepo?.url + '/pulls'"
                  class="text-xs md:text-sm p-button flex-shrink-0 flex items-center gap-x-2 font-content px-3 py-1 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500"
                  rel="noopener noreferrer nofollow"
                  target="_blank">
                <GitPullRequest :size="14"/>
                View All
              </a>
            </div>

            <div v-if="github.selectedRepo.pullRequests?.nodes?.length" class="space-y-2">
              <a
                  v-for="pr in github.selectedRepo.pullRequests.nodes"
                  :key="pr.id"
                  :href="pr.url"
                  class="block p-3 hover:bg-stone-50 dark:hover:bg-stone-600 rounded border border-stone-200 dark:border-stone-600"
                  rel="noopener noreferrer"
                  target="_blank"
              >
                <div class="flex items-start gap-2">
                  <GitPullRequest :size="16" class="text-green-600 mt-1 flex-shrink-0"/>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-heading text-stone-800 dark:text-stone-200 truncate">
                      {{ pr.title }}
                    </h4>
                    <div class="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mt-1">
                      <Clock :size="12"/>
                      <span>Created: {{ formatDate(pr.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <p v-else class="text-red-500 text-sm">No open pull requests.</p>
          </div>

          <!-- Closed Pull Requests -->
          <div class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-heading text-stone-800 dark:text-stone-200">Closed PRs</h3>
              <a
                  v-if="github.selectedRepo.url"
                  :href="github.selectedRepo?.url + '/pulls?q=is%3Apr+is%3Aclosed'"
                  class="text-xs md:text-sm flex-shrink-0 flex items-center gap-x-2 p-button font-content px-3 py-1 !border-0 !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500"
                  rel="noopener noreferrer nofollow"
                  target="_blank">
                <GitPullRequest :size="14"/>
                View All
              </a>
            </div>

            <div v-if="github.selectedRepo.closedPullRequests?.nodes?.length" class="space-y-2">
              <a
                  v-for="pr in github.selectedRepo.closedPullRequests.nodes"
                  :key="pr.id"
                  :href="pr.url"
                  class="block p-3 hover:bg-stone-50 dark:hover:bg-stone-600 rounded border border-stone-200 dark:border-stone-600"
                  rel="noopener noreferrer"
                  target="_blank"
              >
                <div class="flex items-start gap-2">
                  <GitPullRequest :size="16" class="text-red-600 mt-1 flex-shrink-0"/>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-heading text-stone-800 dark:text-stone-200 truncate">
                      {{ pr.title }}
                    </h4>
                    <div class="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mt-1">
                      <Clock :size="12"/>
                      <span>Created: {{ formatDate(pr.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <p v-else class="text-stone-600 dark:text-stone-400 text-sm">No closed pull requests.</p>
          </div>
        </div>

        <!-- RIGHT COLUMN - Sidebar (1/3 width on large screens) -->
        <div
            class="flex flex-col gap-4">
          <!-- Repository Info Card -->
          <div
              class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg flex flex-col gap-2 sm:gap-3">
            <!-- Primary Language Badge -->
            <div v-if="github.selectedRepo.primaryLanguage" class="flex items-center gap-2">
              <FileCode2 :size="16" class="text-stone-500"/>
              <span
                  :style="{ backgroundColor: github.selectedRepo.primaryLanguage.color + '20', color: github.selectedRepo.primaryLanguage.color }"
                  class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ github.selectedRepo.primaryLanguage.name }}
              </span>
            </div>

            <!-- Stats -->
            <div class="flex flex-col gap-2 sm:gap-3">
              <div class="flex items-center gap-2 text-sm">
                <Eye :size="16" class="text-stone-500"/>
                <span>{{ github.selectedRepo.isPrivate ? 'private' : 'public' }} codebase</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <Star :size="16" class="text-stone-500"/>
                <span>{{ github.selectedRepo.stargazerCount }} stars</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <GitFork :size="16" class="text-stone-500"/>
                <span>{{ github.selectedRepo.forkCount }} forks</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <Activity :size="16" class="text-stone-500"/>
                <span>Activity</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <Clock :size="16" class="text-stone-500"/>
                <span>{{ formatDate(github.selectedRepo.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Contributors -->
          <div class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="pi pi-users text-lg"/>
              <h3 class="text-lg font-heading text-stone-800 dark:text-stone-200">Contributors</h3>
            </div>

            <div v-if="topContributors.length" class="space-y-2">
              <div
                  v-for="contributor in topContributors"
                  :key="contributor.login"
                  class="flex items-center gap-2"
              >
                <img
                    v-if="contributor.avatarUrl"
                    :alt="contributor.name"
                    :src="contributor.avatarUrl"
                    class="w-8 h-8 rounded-full"
                />
                <div v-else
                     class="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center">
                  <span class="text-xs">{{ contributor.name?.[0] || '?' }}</span>
                </div>
                <span class="text-sm">{{ contributor.name }}</span>
              </div>
            </div>
            <p v-else class="text-sm text-stone-600 dark:text-stone-400">No contributors found</p>
          </div>

          <!-- Project Topics -->
          <div class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="pi pi-tag text-lg"/>
              <h3 class="text-lg font-heading text-stone-800 dark:text-stone-200">Project Topics</h3>
            </div>

            <div v-if="github.selectedRepo.repositoryTopics?.edges?.length" class="flex flex-wrap gap-2">
              <span
                  v-for="topic in github.selectedRepo.repositoryTopics.edges"
                  :key="topic.node.topic.name"
                  class="px-2 py-1 bg-stone-100 dark:bg-stone-600 rounded-full text-xs"
              >
                {{ topic.node.topic.name }}
              </span>
            </div>
            <p v-else class="text-sm text-stone-600 dark:text-stone-400">No topics</p>
          </div>

          <!-- Languages -->
          <div class="p-4 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="pi pi-code text-lg"/>
              <h3 class="text-lg font-heading text-stone-800 dark:text-stone-200">Languages</h3>
            </div>

            <div v-if="languagePercentages.length" class="flex items-center flex-wrap gap-2">
              <div
                  v-for="lang in languagePercentages"
                  :key="lang.name"
                  class="flex items-center justify-between gap-x-5 text-sm border border-stone-300 dark:border-stone-600 rounded-full py-1 px-3"
              >
                <div class="flex items-center gap-2">
                  <span
                      :style="{ backgroundColor: lang.color }"
                      class="w-3 h-3 rounded-full"
                  />
                  <span>{{ lang.name }}</span>
                </div>
                <span class="text-stone-600 dark:text-stone-400">{{ lang.percentage }}%</span>
              </div>
            </div>
            <p v-else class="text-sm text-stone-600 dark:text-stone-400">No languages detected</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback -->
    <div v-else class="p-4 text-center text-stone-600 dark:text-stone-400">
      No repository data available
    </div>
  </BaseLayout>
</template>

<style lang="css" scoped>
/* Smooth transitions */
a, button {
  transition: all 0.2s ease;
}
</style>
