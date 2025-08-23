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

export const useGithubStore = defineStore('github', () => {
    const profileData = ref<GithubProfileData | null>(null)
    const loading = ref(false)
    const loadingNotifications = ref(false)
    const error = ref<string | null>(null)
    const notificationsError = ref<string | null>(null)
    const notifications = ref<any>([])
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
        fetchGithubData
    }
})
