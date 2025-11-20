export default defineNuxtRouteMiddleware((to, from) => {
    // Only protect routes that start with /admin
    if (to.path.startsWith('/admin')) {
        const user = useCookie('user');
        
        if(!user.value) {
            console.log("Auth middleware: No user found, redirecting to login");
            return navigateTo('/');
        }
        
        console.log("Auth middleware: User authenticated", user.value);
    }
})
