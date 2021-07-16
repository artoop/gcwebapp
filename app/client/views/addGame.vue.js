const addGamePage = Vue.component("AddGamePage", {
    template: /* html */`
        <v-container class="home-page" fluid>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-text>
                            <v-data-table
                                :headers="headers"
                                :items="games"
                                :items-per-page="50"
                            >
                                <template v-slot:top>
                                    <div class="d-flex">
                                        <v-toolbar-title>Jogos</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" dark class="mb-2" @click="openDialogCreate">
                                            Novo Jogo
                                        </v-btn>
                                    </div>
                                    <v-divider></v-divider>
                                </template>
                                
                                <template v-slot:item.platforms="{ item }">
                                    <v-chip v-for="platform in item.platforms" class="mr-1">{{ platform.acronym }}</v-chip>
                                </template>
                                
                                <template v-slot:item.tags="{ item }">
                                    <v-chip v-for="tag in item.tags" class="mr-1">{{ tag.name }}</v-chip>
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <v-icon
                                        small
                                        class="mr-2"
                                        @click="editItem(item)"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                    <v-icon
                                        color="red darken-1"
                                        small
                                        @click="deleteItem(item)"
                                    >
                                        mdi-delete
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            
            <v-dialog
                v-model="dialogCreate.active"
                persistent
                max-width="800px"
            >
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Adicionar Jogo</span>
                    </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="dialogCreate.game.title" label="Título" outlined hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="dialogCreate.game.description" label="Descrição" outlined hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-select v-model="dialogCreate.game.developer" :items="developers" attach chips label="Desenvolvedor" outlined hide-details item-text="name" item-value="_id"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-select v-model="dialogCreate.game.publishers" :items="publishers" attach chips label="Publicadores" multiple outlined hide-details item-text="name" item-value="_id"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input outlined label="Capa" prepend-icon="mdi-camera" @change="previewBanner" v-model="dialogCreate.game.banner"></v-file-input>
                            <v-row v-if="bannerPreview" justify="center">
                                <v-col cols="8">
                                    <v-img :src="bannerPreview"></v-img>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input
                                chips
                                multiple
                                outlined
                                label="Imagens"
                                prepend-icon="mdi-camera"
                                @change="previewImages"
                                v-model="dialogCreate.game.images"
                            ></v-file-input>
                            <v-row v-if="imagePreviews.length">
                                <template v-for="preview in imagePreviews">
                                    <v-col cols="2">
                                        <v-img :src="preview"></v-img>
                                    </v-col>
                                </template>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <v-select v-model="dialogCreate.game.platforms" :items="platforms" item-value="_id" attach chips label="Plataformas" multiple outlined hide-details>
                                <template v-slot:selection="{ item }">
                                    <v-chip>{{ item.acronym }}</v-chip>
                                </template>
                                <template v-slot:item="{ item, attrs }">
                                    <v-checkbox :value="attrs.inputValue" hide-details class="ma-0"></v-checkbox>
                                    <v-img class="ml-5" :src="item.icon" max-width="30"></v-img>
                                    <span class="ml-5">{{ item.acronym }}</span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-select v-model="dialogCreate.game.tags" :items="tags" attach chips label="Tags" multiple outlined hide-details></v-select>
                        </v-col>

                    </v-row>
                    
                    <span>{{ dialogCreate.message }}</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            color="red darken-1"
                            text
                            @click="closeDialogCreate"
                        >
                            Fechar
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="addGame(); closeDialogCreate();"
                        >
                            Salvar
                        </v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            
        </v-container>`,

    data: () => {
        return {
            headers: [
                { text: "Título", value: "title" },
                { text: "Descrição", value: "description" },
                { text: "Desenvolvedor", value: "developer" },
                { text: "Publicadores", value: "publishers" },
                { text: "Plataformas", value: "platforms" },
                { text: "Tags", value: "tags" },
                { text: "Ações", value: "actions", sortable: false },
            ],

            developers: [],
            publishers: [],
            platforms: [],
            tags: [],
            games: [],
            imagePreviews: [],
            bannerPreview: null,

            dialogCreate: {
                active: false,
                game: {
                    title: "",
                    description: "",
                    developer: null,
                    publishers: [],
                    platforms: [],
                    tags: [],
                    banner: null,
                    images: []
                },
                message: ""
            },
        }
    },

    created() {
        this.loadGames();
        this.loadPlatforms();
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

        loadPlatforms() {
            this.$api.get("/platforms").then(res => {
                const data = res.data;

                if (data.success) {
                    this.platforms = data.data.platforms;
                }
            }).catch(err => {
                console.error(err);
            });
        },

        openDialogCreate() {
            this.dialogCreate.active = true;
        },

        closeDialogCreate() {
            this.dialogCreate.active = false;
            this.dialogCreate.game = {
                title: "",
                description: "",
                developer: null,
                publishers: [],
                platforms: [],
                tags: [],
                banner: null,
                images: []
            }

            this.imagePreviews = [];
            this.bannerPreview = null;
        },

        addGame() {
            const formData = new FormData();

            formData.append('banner', this.dialogCreate.game.banner);
            for(let i = 0; i < this.dialogCreate.game.images.length; i++) {
                formData.append('images', this.dialogCreate.game.images[i]);
            }

            delete this.dialogCreate.game.banner;
            delete this.dialogCreate.game.images;

            formData.append('data', JSON.stringify(this.dialogCreate.game));

            this.$api.post("/games", formData, options={
                'headers': {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                // const data = res.data;
                this.loadGames();
            }).catch(err => {
                console.error(err);
            });
        },

        previewImages(files) {
            this.imagePreviews = files.map(el => URL.createObjectURL(el));
        },

        previewBanner(file) {
            this.bannerPreview = URL.createObjectURL(file);
        }

    },
});
