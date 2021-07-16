const homePage = Vue.component("HomePage", {
    template: /* html */`
        <v-container class="home-page" fluid>
            <v-row>
                <template v-for="game in games">
                    <v-col cols="6">
                        <game-card :game="game"></game-card>
                        
                    </v-col>
                </template>

            </v-row>
        </v-container>`,

    data: () => {
        return {
            games: []
        }
    },

    created() {
        this.loadGames();
    },

    methods: {
        loadGames() {
            this.$api.get("/games").then(res => {
                const data = res.data;

                if (data.success) {
                    this.games = data.data.games;
                }
            }).catch(err => {
                console.error(err);
            });
        },
    },
});
