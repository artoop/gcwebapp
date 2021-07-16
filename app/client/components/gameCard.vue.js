const gameCard = Vue.component("GameCard", {
    template: /* html */
        `
        <v-container>
            <v-card
                elevation="2"
                outlined
            >
                <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <div style="cursor: pointer" @click="goToGame">
                            <v-card-title
                                class="text-h5"
                                v-text="game.title"
                            >
                            </v-card-title>
                        
                            <v-card-subtitle>{{ game.description }}</v-card-subtitle>
                            
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" class="d-flex flex-row">
                                        <template v-for="k in game.platforms">
                                            <v-chip>{{ k.acronym }}</v-chip>
                                        </template>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </div>
                        
                        <v-card-actions>
                            <v-btn
                                class="ml-2 mt-3"
                                fab
                                icon
                                height="40px"
                                right
                                width="40px"
                            >
                                <v-icon :color="game.favorite ? 'red' : 'gray'" @click="favoriteGame">mdi-heart</v-icon>
                            </v-btn>
                            <v-btn
                                class="ml-2 mt-3"
                                fab
                                icon
                                height="40px"
                                right
                                width="40px"
                            >
                                <v-icon :color="game.wishlist ? 'blue' : 'gray'" @click="wishlistGame">mdi-playlist-plus</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </div>
                    
                    <v-avatar
                        class="ma-3"
                        size="125"
                        tile
                        style="cursor: pointer" @click="goToGame"
                    >
                        <v-img :src="game.banner_url"></v-img>
                    </v-avatar>
                </div>
            </v-card>
        </v-container>
    `,

    props: ["game"],

    data: () => {
        return {

        }
    },

    computed: {

    },

    methods: {
        favoriteGame() {
            this.$api.post("/favorites", {
                "game_id": this.game._id,
                "active": !this.game.favorite
            }).then(res => {
                const data = res.data;

                if (data.success) {
                    this.game.favorite = !this.game.favorite;

                    this.$emit("favorite", {
                        "game_id": this.game._id,
                        "active": this.game.favorite
                    })
                }
            }).catch(err => {
                console.error(err);
            });
        },

        wishlistGame() {
            this.$api.post("/wishlist", {
                "game_id": this.game._id,
                "active": !this.game.wishlist
            }).then(res => {
                const data = res.data;

                if (data.success) {
                    this.game.wishlist = !this.game.wishlist;

                    this.$emit("wishlist", {
                        "game_id": this.game._id,
                        "active": this.game.wishlist
                    })
                }
            }).catch(err => {
                console.error(err);
            });
        },

        goToGame() {
            this.$router.push({path: `game/${this.game.code}`})
        }
    }
});
