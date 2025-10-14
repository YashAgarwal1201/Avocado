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
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: number
                weeks: ContributionWeek[]
            }
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

export interface PullRequestNode {
    id: string
    number: number
    title: string
    url: string
    createdAt: string
    updatedAt: string
    state: string
    isDraft: boolean
    author: {
        login: string
        avatarUrl: string
    }
    additions: number
    deletions: number
    changedFiles: number
    headRefName: string
    baseRefName: string
    comments: { totalCount: number }
    reviews: { totalCount: number }
    commits: { totalCount: number }
}

export interface GithubRepositoryDetails {
    id: string
    name: string
    description?: string
    url: string
    homepageUrl?: string
    createdAt: string
    updatedAt: string
    pushedAt: string
    stargazerCount: number
    forkCount: number
    watchers: { totalCount: number }
    isPrivate: boolean
    isFork: boolean
    isArchived: boolean
    diskUsage?: number
    primaryLanguage?: {
        name: string
        color: string
    }
    languages: {
        edges: Array<{
            size: number
            node: {
                name: string
                color: string
            }
        }>
    }
    repositoryTopics: {
        edges: Array<{
            node: {
                topic: {
                    name: string
                }
            }
        }>
    }
    licenseInfo?: {
        name: string
        spdxId: string
    }
    defaultBranchRef?: {
        name: string
        target: {
            history: {
                totalCount: number
                edges: Array<{
                    node: {
                        message: string
                        committedDate: string
                        author: {
                            name: string
                            email: string
                        }
                    }
                }>
            }
        }
    }
    pullRequests: {
        totalCount: number
        nodes: PullRequestNode[]
    }
    mergedPullRequests: { totalCount: number }
    closedPullRequests: { totalCount: number }
    releases: {
        totalCount: number
        nodes: Array<{
            name: string
            tagName: string
            publishedAt: string
            url: string
        }>
    }
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

export interface ContributionWeek {
    contributionDays: ContributionDay[]
}

export interface ContributionDay {
    date: string
    contributionCount: number
}
