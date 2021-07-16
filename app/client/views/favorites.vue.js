const favoritesPage = Vue.component("FavoritesPage", {
    template: /* html */`
        <v-container class="home-page" fluid>
            <v-row justify="center">
                <v-col cols="8">
                    <template v-if="games && games.length">
                        <template v-for="game in games">
                            <game-card :game="game" @favorite="handleFavorite"></game-card>
                        </template>
                    </template>
                    <template v-else>
                        <div class="text-center">
                            <span class="text-h5 white--text">Nenhum jogo nos favoritos</span>
                        </div>
                    </template>
                </v-col>
            </v-row>
        </v-container>`,

    data: () => {
        return {
            games: []
        }
    },

    created() {
        this.loadFavorites();
    },

    methods: {
        loadFavorites() {
            this.$api.get("/favorites").then(res => {
                const data = res.data;

                if (data.success) {
                    this.games = data.data.favorites;
                }
            }).catch(err => {
                console.error(err);
            });
        },

        handleFavorite(data) {
            if (!data.active) {
                this.games = this.games.filter(el => el._id !== data.game_id);
            }
        }
    },
});
