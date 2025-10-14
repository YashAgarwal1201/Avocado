import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import Dashboard from '../pages/Dashboard.vue'
import CustomiseApp from "../pages/CustomiseApp.vue";
import RepoDetails from "../pages/RepoDetails.vue";
import ReposListPage from "../pages/ReposListPage.vue";
import PRsListPage from "../pages/PRsListPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: HomePage,
            meta: {title: 'Welcome to Avocado world'},
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {title: 'View your github dashboard'},
        },
        {
            path: '/dashboard/repos-list',
            name: 'Repos List',
            component: ReposListPage,
            meta: {title: 'View your github repos list '},
        },
        {
            path: '/dashboard/repos-list/:repoName',
            name: 'Repo Details',
            component: RepoDetails,
            meta: {title: 'View your github repo details'},
        },
        {
            path: '/dashboard/prs-list',
            name: 'Open PRs List',
            component: PRsListPage,
            meta: {title: 'View your github open prs list'},
        },
        {
            path: '/customise-app',
            name: 'customise-app',
            component: CustomiseApp,
            meta: {title: 'Customise your github dashboard'},
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
})

router.beforeEach((to, from, next) => {
    console.log('from:', from.path)
    const githubToken = localStorage.getItem('github_pat_token')

    // Allow access to Home page regardless of auth
    if (to.path === '/') {
        return next()
    }

    // If token exists, allow navigation
    if (githubToken) {
        return next()
    }

    // If token doesn't exist, redirect to Home
    return next('/')
})

export default router
