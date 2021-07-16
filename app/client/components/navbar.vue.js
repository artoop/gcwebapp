const navbar = Vue.component("Navbar", {
    template: /* html */
        `
        <v-app-bar color="primary" dark dense>
            <v-toolbar-title>
                <v-btn text :to="{ name: 'Home' }">Home</v-btn>
            </v-toolbar-title>
            
            <template v-if="isAuthenticated">
                <v-btn color="primary" :to="{ name: 'Favorites' }" class="ml-2">Favoritos</v-btn>
                <v-btn color="primary" :to="{ name: 'Wishlist' }" class="ml-2">Interesses</v-btn>
            </template>
            
            <v-spacer></v-spacer>
            
            <v-menu offset-y v-if="isAuthenticated && isAdmin">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        Admin
                    </v-btn>
                </template>
                
                <v-list>
                    <v-list-item>
                        <v-btn dark :to="{ name: 'AddGame' }">Jogos</v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn dark :to="{ name: 'Platforms' }">Plataformas</v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
            
            <template v-if="!isAuthenticated && $route.path != '/login'">
                <v-btn :to="{ name: 'Login' }">Login</v-btn>
            </template>
            <template v-else-if="isAuthenticated">
                <span class="mx-5">Logged in as {{ $store.getters.user.username }}</span>
                <v-btn @click="logout">Logout</v-btn>
            </template>
        </v-app-bar>
    `,

    props: [],

    data: () => {
        return {
            tab: null,
            code: "",
        }
    },

    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        },
        isAdmin() {
            return this.$store.getters.isAdmin;
        }
    },

    methods: {
        logout() {
            this.$store.dispatch("logout");
        }
    }
});
