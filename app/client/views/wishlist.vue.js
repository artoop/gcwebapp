const wishlistPage = Vue.component("WishlistPage", {
    template: /* html */`
        <v-container class="home-page" fluid>
            <v-row justify="center">
                <v-col cols="8">
                    <template v-if="games && games.length">
                        <template v-for="game in games">
                            <game-card :game="game" @wishlist="handleWishlist"></game-card>
                        </template>
                    </template>
                    <template v-else>
                        <div class="text-center">
                            <span class="text-h5 white--text">Nenhum jogo nos interesses</span>
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
        this.loadWishlist();
    },

    methods: {
        loadWishlist() {
            this.$api.get("/wishlist").then(res => {
                const data = res.data;

                if (data.success) {
                    this.games = data.data.wishlist;
                }
            }).catch(err => {
                console.error(err);
            });
        },

        handleWishlist(data) {
            if (!data.active) {
                this.games = this.games.filter(el => el._id !== data.game_id);
            }
        }
    },
});
