import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {GithubProfileData} from "../types/github.ts";

export const useGithubStore = defineStore('github', () => {
    const profileData = ref<GithubProfileData | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const token = ref<string | null>(localStorage.getItem('github_pat_token'))

    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem('github_pat_token', newToken)
    }

    async function fetchGithubData() {
        if (!token.value) {
            error.value = 'GitHub token not found'
            return
        }

        loading.value = true
        error.value = null

        try {
            const query = `
        query {
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
            repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
          }
        }
      `

            const res = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query})
            })

            const json = await res.json()

            if (json.errors) {
                throw new Error(json.errors.map((e: any) => e.message).join(', '))
            }

            profileData.value = json.data
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return {
        profileData,
        loading,
        error,
        token,
        setToken,
        fetchGithubData
    }
})
