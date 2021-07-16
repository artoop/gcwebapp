import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: homePage
    },
    {
        path: "/login",
        name: "Login",
        component: loginPage,
        meta: {
            authenticated: false
        }
    },
    {
        path: "/register",
        name: "Register",
        component: registerPage,
        meta: {
            authenticated: false
        }
    },
    {
        path: "/addGame",
        name: "AddGame",
        component: addGamePage,
        meta: {
            authenticated: true,
            adminRequired: true
        }
    },
    {
        path: "/game/:id",
        name: "Game",
        component: gamePage,
        meta: {
            authenticated: true,
        }
    },
    {
        path: "/platforms",
        name: "Platforms",
        component: platformsPage,
        meta: {
            authenticated: true,
            adminRequired: true
        }
    },
    {
        path: "/favorites",
        name: "Favorites",
        component: favoritesPage,
        meta: {
            authenticated: true,
        }
    },
    {
        path: "/wishlist",
        name: "Wishlist",
        component: wishlistPage,
        meta: {
            authenticated: true,
        }
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async (to, from, next) => {
    // seems authenticated but has no user info, so refresh auth
    if (!store.getters.isAuthenticated && store.getters.isLocalAuthenticated) {
        await store.dispatch('refresh');
    }
    if (to.matched.some(record => record.meta.adminRequired === true)) {
        if(!store.getters.isAdmin){
            return next({ name: "Home"})
        }
        return next();
    }
    if (to.matched.some(record => record.meta.authenticated === false)) {
        if(store.getters.isAuthenticated){
            return next({ name: "Home"})
        }
        return next();
    }
    if (to.matched.some(record => record.meta.authenticated === true)) {
        if(!store.getters.isAuthenticated){
            return next({ name: "Login"})
        }
        return next();
    }
    return next();
})

export default router;
