const gamePage = Vue.component("GamePage", {
    template: /* html */`
        <v-container class="home-page">
            <template v-if="game">
                <v-row style="background-color: #485F6E60">
                    <v-col cols="12">
                        <v-img :src="game.banner_url" max-height="350" contain></v-img>
                    </v-col>
                </v-row>
                
                <v-row>
                    <v-col cols="8">
                        <v-row>
                            <v-col cols="12" style="background-color: #485F6E">
                                <span class="text-h3 white--text">{{ game.title }}</span>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" style="background-color: #485F6E30">
                                <p class="text-h6 white--text">
                                    {{ game.description }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="4">
                        <v-row>
                            <v-col cols="12">
                                
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-list>
                                    <v-list-item v-for="k in game.platforms">
                                        <v-img :src="k.icon" max-width="25" class="mr-2"></v-img>
                                        {{ k.name }}
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </template>

        </v-container>`,

    data: () => {
        return {
            game: null
        }
    },

    created() {
        this.loadGame(this.$route.params.id);
    },

    methods: {
        loadGame(id) {
            this.$api.get(`/games/${id}`).then(res => {
                const data = res.data;

                if (data.success) {
                    this.game = data.data.game;
                }
            }).catch(err => {
                console.error(err);
            });
        }
    },
});
