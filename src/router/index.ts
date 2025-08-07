import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: HomePage,
      meta: { title: "Welcome to Avocado world" },
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const { showToast } = toastHandler();

//   // Check if cookie exists more reliably
//   const hasAccountCookie = document.cookie
//     .split(";")
//     .map((cookie) => cookie.trim())
//     .some((cookie) => cookie.startsWith("OrchidStoreLoginAccount="));

//   // If going to landing page and already logged in
//   if (to.path === "/" && hasAccountCookie) {
//     showToast(
//       "info",
//       "User is logged in",
//       "You are already logged in, navigating you to products page"
//     );
//     return next("/products");
//   }

// If going to protected pages and NOT logged in
//   if (
//     (to.path === "/products" ||
//       to.path.startsWith("/products/") ||
//       to.path === "/profile" ||
//       to.path === "/trending") &&
//     !hasAccountCookie
//   ) {
//     showToast(
//       "warn",
//       "Authentication required",
//       "Please log in to access this page"
//     );
//     return next("/");
//   }

// Otherwise proceed normally
//   next();
// });

export default router;
