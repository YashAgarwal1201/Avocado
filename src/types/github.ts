export interface GithubProfileData {
    viewer: {
        login: string
        name: string
        avatarUrl: string
        bio?: string
        company?: string
        location?: string
        twitterUsername?: string
        websiteUrl?: string
        url: string
        createdAt: string
        followers: { totalCount: number }
        following: { totalCount: number }
        repositories: {
            totalCount: number
            nodes: GithubRepository[]
        }
        pullRequests: {
            totalCount: number
            nodes: GithubPullRequest[]
        }
        notifications: GithubNotification[] // We'll fake this because notifications are REST-only
    }
}

export interface GithubRepository {
    id: string
    name: string
    description?: string
    url: string
    stargazerCount: number
    forkCount: number
    primaryLanguage?: {
        name: string
        color: string
    }
    updatedAt: string
}

export interface GithubPullRequest {
    id: string
    title: string
    url: string
    createdAt: string
    state: string
    repository: {
        name: string
        url: string
    }
}

export interface GithubNotification {
    id: string
    title: string
    url: string
    repositoryName: string
}
