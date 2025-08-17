import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import Dashboard from '../pages/Dashboard.vue'
import CustomiseApp from "../pages/CustomiseApp.vue";

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
            meta: {title: 'View your GitHub dashboard'},
        },
        {
            path: '/customise-app',
            name: 'customise-app',
            component: CustomiseApp,
            meta: {title: 'Customise your GitHub dashboard'},
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
