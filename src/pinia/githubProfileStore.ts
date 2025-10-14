// import {defineStore} from 'pinia'
// import {ref} from 'vue'
// import type {GithubProfileData} from "../types/github.ts";
// import toastHandler from "../composables/toastHandler.ts";
// import {GITHUB_GRAPHQL_ENDPOINT, GITHUB_NOTIFICATIONS_API_ENDPOINT} from "../constants/BaseConstants.ts";
//
// export const useGithubStore = defineStore('github', () => {
//     const profileData = ref<GithubProfileData | null>(null)
//     const loading = ref(false)
//     const loadingNotifications = ref(false)
//     const error = ref<string | null>(null)
//     const notificationsError = ref<string | null>(null)
//     const notifications = ref<any>([])
//     const token = ref<string | null>(localStorage.getItem('github_pat_token'))
//
//     const {showToast} = toastHandler()
//
//     function setToken(newToken: string) {
//         token.value = newToken
//         localStorage.setItem('github_pat_token', newToken)
//     }
//
//     async function fetchGithubData() {
//         if (!token.value) {
//             error.value = 'GitHub token not found'
//             showToast("error", "Error", "No github token found.")
//             return
//         }
//
//         loading.value = true
//         error.value = null
//
//         try {
//             const query = `
//         query {
//           viewer {
//             login
//             name
//             avatarUrl
//             bio
//             company
//             location
//             twitterUsername
//             websiteUrl
//             url
//             createdAt
//             followers { totalCount }
//             following { totalCount }
//             repositories(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
//               totalCount
//               nodes {
//                 id
//                 name
//                 description
//                 url
//                 stargazerCount
//                 forkCount
//                 primaryLanguage {
//                   name
//                   color
//                 }
//                 updatedAt
//               }
//             }
//             pullRequests(first: 5, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
//               totalCount
//               nodes {
//                 id
//                 title
//                 url
//                 createdAt
//                 state
//                 repository {
//                   name
//                   url
//                 }
//               }
//             }
//             contributionsCollection(from: $from, to: $to) {
//                             contributionCalendar {
//                                 totalContributions
//                                 weeks {
//                                     contributionDays {
//                                         date
//                                         contributionCount
//                                     }
//                                 }
//                             }
//                         }
//           }
//         }
//       `
//
//             const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${token.value}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({query})
//             })
//
//             const json = await res.json()
//
//             if (json.errors) {
//                 showToast("error", "Error", "Looks like some error happened.")
//                 throw new Error(json.errors.map((e: any) => e.message).join(', '))
//             }
//
//             profileData.value = json.data
//             showToast("success", "Success", "Data fetched successfully.")
//         } catch (err: any) {
//             error.value = err.message
//         } finally {
//             loading.value = false
//         }
//     }
//
//     async function loadNotifications() {
//         if (!token.value) {
//             error.value = 'GitHub token not found'
//             showToast("error", "Error", "No github token found.")
//             return
//         }
//
//         loadingNotifications.value = true
//         notificationsError.value = null
//
//         try {
//             const res = await fetch(`${GITHUB_NOTIFICATIONS_API_ENDPOINT}`, {
//                 headers: {
//                     Authorization: `Bearer ${token.value}`,
//                     Accept: "application/vnd.github+json",
//                 },
//                 cache: "no-cache"
//             })
//             if (!res.ok) {
//                 showToast("error", "Failed to load notifications.", "Please check console for more information.")
//                 console.error("Failed to load notifications:", res.status, res.statusText)
//                 throw new Error(`Notifications fetch failed: ${res.status}`)
//             }
//             notifications.value = await res.json()
//         } catch (err: any) {
//             notificationsError.value = err.message
//             console.error("Failed to load notifications:", err.message)
//         } finally {
//             loadingNotifications.value = false
//         }
//     }
//
//     return {
//         profileData,
//         loading,
//         loadingNotifications,
//         error,
//         notificationsError,
//         token,
//         notifications,
//         setToken,
//         loadNotifications,
//         fetchGithubData
//     }
// })


// stores/github.ts
import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {GithubProfileData} from "../types/github.ts";
import toastHandler from "../composables/toastHandler.ts";
import {GITHUB_GRAPHQL_ENDPOINT, GITHUB_NOTIFICATIONS_API_ENDPOINT} from "../constants/BaseConstants.ts";
import {REPO_DETAILS_FRAGMENT} from "../constants/RepoDetailsGraphQLQuery.ts";

export const useGithubStore = defineStore('github', () => {
    const profileData = ref<GithubProfileData | null>(null)
    const loading = ref(false)
    const loadingNotifications = ref(false)
    const error = ref<string | null>(null)
    const notificationsError = ref<string | null>(null)
    const notifications = ref<any>([])

    const selectedRepo = ref<any>(null)
    const repoDetailsCache = ref<Map<string, { data: any; timestamp: number }>>(new Map())
    const loadingRepo = ref(false)
    const repoError = ref<string | null>(null)

    const token = ref<string | null>(localStorage.getItem('github_pat_token'))

    const {showToast} = toastHandler()

    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem('github_pat_token', newToken)
    }

    async function fetchGithubData() {
        if (!token.value) {
            error.value = 'GitHub token not found'
            showToast("error", "Error", "No github token found.")
            return
        }

        loading.value = true
        error.value = null

        try {
            const oneYearAgo = new Date()
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

            const query = `
                query($from: DateTime!, $to: DateTime!) {
                    viewer {
                        login
                        name
                        avatarUrl
                        bio
                        company
                        location
                        twitterUsername
                        websiteUrl
                        url
                        createdAt
                        followers { totalCount }
                        following { totalCount }
                        repositories(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
                            totalCount
                            nodes {
                                id
                                name
                                description
                                url
                                stargazerCount
                                forkCount
                                primaryLanguage {
                                    name
                                    color
                                }
                                updatedAt
                            }
                        }
                        pullRequests(first: 5, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
                            totalCount
                            nodes {
                                id
                                title
                                url
                                createdAt
                                state
                                repository {
                                    name
                                    url
                                }
                            }
                        }
                        contributionsCollection(from: $from, to: $to) {
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        date
                                        contributionCount
                                    }
                                }
                            }
                        }
                    }
                }
            `

            const variables = {
                from: oneYearAgo.toISOString(),
                to: new Date().toISOString()
            }

            const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query, variables})
            })

            const json = await res.json()

            if (json.errors) {
                showToast("error", "Error", "Looks like some error happened.")
                throw new Error(json.errors.map((e: any) => e.message).join(', '))
            }

            profileData.value = json.data
            showToast("success", "Success", "Data fetched successfully.")
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    async function loadNotifications() {
        if (!token.value) {
            error.value = 'GitHub token not found'
            showToast("error", "Error", "No github token found.")
            return
        }

        loadingNotifications.value = true
        notificationsError.value = null

        try {
            const res = await fetch(`${GITHUB_NOTIFICATIONS_API_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    Accept: "application/vnd.github+json",
                },
                cache: "no-cache"
            })
            if (!res.ok) {
                showToast("error", "Failed to load notifications.", "Please check console for more information.")
                console.error("Failed to load notifications:", res.status, res.statusText)
                throw new Error(`Notifications fetch failed: ${res.status}`)
            }
            notifications.value = await res.json()
        } catch (err: any) {
            notificationsError.value = err.message
            console.error("Failed to load notifications:", err.message)
        } finally {
            loadingNotifications.value = false
        }
    }

    // Optimization #2: Caching with TTL (5 minutes)
    const CACHE_TTL = 5 * 60 * 1000

    function getCachedRepo(repoKey: string) {
        const cached = repoDetailsCache.value.get(repoKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data
        }
        return null
    }

    function setCacheRepo(repoKey: string, data: any) {
        repoDetailsCache.value.set(repoKey, {
            data,
            timestamp: Date.now()
        })
    }

// Optimization #3: Single optimized GraphQL query
    async function fetchRepositoryDetails(owner: string, repoName: string) {
        const repoKey = `${owner}/${repoName}`

        // Check cache first
        const cached = getCachedRepo(repoKey)
        if (cached) {
            selectedRepo.value = cached
            return cached
        }

        if (!token.value) {
            repoError.value = 'GitHub token not found'
            showToast("error", "Error", "No github token found.")
            throw new Error('No token found')
        }

        loadingRepo.value = true
        repoError.value = null

        try {
            const query = `
      query GetRepository($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          ...RepoDetails
        }
      }
      ${REPO_DETAILS_FRAGMENT}
    `

            const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables: {owner, name: repoName}
                })
            })

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`)
            }

            const json = await res.json()

            if (json.errors) {
                const errorMsg = json.errors.map((e: any) => e.message).join(', ')
                showToast("error", "Error", "Failed to fetch repository details.")
                throw new Error(errorMsg)
            }

            const repoData = json.data.repository
            selectedRepo.value = repoData
            setCacheRepo(repoKey, repoData)

            return repoData
        } catch (err: any) {
            repoError.value = err.message
            showToast("error", "Error", err.message)
            throw err
        } finally {
            loadingRepo.value = false
        }
    }

// Optimization #4: Batch fetch for multiple repos (if needed)
    async function fetchMultipleRepositories(repos: Array<{ owner: string; name: string }>) {
        if (!token.value) {
            repoError.value = 'GitHub token not found'
            showToast("error", "Error", "No github token found.")
            return []
        }

        loadingRepo.value = true
        repoError.value = null

        try {
            // Build dynamic query for multiple repos
            const repoQueries = repos
                .map((repo, idx) => `
        repo${idx}: repository(owner: "${repo.owner}", name: "${repo.name}") {
          ...RepoDetails
        }
      `)
                .join('\n')

            const query = `
      query GetMultipleRepositories {
        ${repoQueries}
      }
      ${REPO_DETAILS_FRAGMENT}
    `

            const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query})
            })

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`)
            }

            const json = await res.json()

            if (json.errors) {
                throw new Error(json.errors.map((e: any) => e.message).join(', '))
            }

            const results = Object.values(json.data)

            // Cache all fetched repos
            results.forEach((repo: any, idx) => {
                const repoKey = `${repos[idx].owner}/${repos[idx].name}`
                setCacheRepo(repoKey, repo)
            })

            return results
        } catch (err: any) {
            repoError.value = err.message
            showToast("error", "Error", err.message)
            return []
        } finally {
            loadingRepo.value = false
        }
    }

// Optimization #5: Clear cache utility
    function clearRepoCache() {
        repoDetailsCache.value.clear()
    }


    return {
        profileData,
        loading,
        loadingNotifications,
        error,
        notificationsError,
        token,
        notifications,
        setToken,
        loadNotifications,
        fetchGithubData,
        selectedRepo,
        loadingRepo,
        repoError,
        fetchRepositoryDetails,
        fetchMultipleRepositories,
        clearRepoCache
    }
})
