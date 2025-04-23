export default defineNuxtRouteMiddleware((to) => {
    // If the route doesn't exist and it's not already the dashboard
    if (!to.matched.length && to.path !== '/dashboard') {
        return navigateTo('/dashboard')
    }
}) 