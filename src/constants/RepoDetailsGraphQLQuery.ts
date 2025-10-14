export const REPO_DETAILS_FRAGMENT = `
  fragment RepoDetails on Repository {
    id
    name
    description
    url
    homepageUrl
    createdAt
    updatedAt
    pushedAt
    stargazerCount
    forkCount
    watchers { totalCount }
    isPrivate
    isFork
    isArchived
    diskUsage
    primaryLanguage {
      name
      color
    }
    languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
      totalSize
      edges {
        size
        node {
          name
          color
        }
      }
    }
    repositoryTopics(first: 20) {
      edges {
        node {
          topic {
            name
          }
        }
      }
    }
    licenseInfo {
      name
      spdxId
    }
    defaultBranchRef {
      name
      target {
        ... on Commit {
          history(first: 100) {
            totalCount
            edges {
              node {
                author {
                  user {
                    login
                    avatarUrl
                  }
                  name
                  email
                }
              }
            }
          }
        }
      }
    }
    pullRequests(first: 20, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        id
        number
        title
        url
        createdAt
        updatedAt
        state
        isDraft
        author {
          login
          avatarUrl
        }
        headRefName
        baseRefName
      }
    }
    closedPullRequests: pullRequests(first: 20, states: CLOSED, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        id
        number
        title
        url
        createdAt
      }
    }
    mergedPullRequests: pullRequests(first: 1, states: MERGED) {
      totalCount
    }
    releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        tagName
        publishedAt
        url
      }
    }
  }
`
