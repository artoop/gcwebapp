const platformsPage = Vue.component("PlatformsPage", {
    template: /* html */`
        <v-container class="home-page" fluid>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-text>
                            <v-data-table
                                :headers="headers"
                                :items="platforms"
                                :items-per-page="50"
                            >
                                <template v-slot:top>
                                    <div class="d-flex">
                                        <v-toolbar-title>Plataformas</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" dark class="mb-2" @click="openDialogCreate">
                                            Nova Plataforma
                                        </v-btn>
                                    </div>
                                    <v-divider></v-divider>
                                </template>
                                
                                <template v-slot:item.icon="{ item }">
                                    <v-img :src="item.icon" max-width="30"></v-img>
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
                        <span class="text-h5">Adicionar Plataforma</span>
                    </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="dialogCreate.platform.name" label="Nome" outlined hide-details></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="dialogCreate.platform.acronym" label="Sigla" outlined hide-details></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-select v-model="dialogCreate.platform.icon" :items="icons" label="Ícone" outlined hide-details>
                                <template v-slot:selection="{ item }">
                                    <v-img :src="item" max-width="30"></v-img>
                                </template>
                                <template v-slot:item="{ item }">
                                    <v-img :src="item" max-width="30"></v-img>
                                </template>
                            </v-select>
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
                            @click="addPlatform(); closeDialogCreate()"
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
                { text: "Ícone", value: "icon", sortable: false },
                { text: "Sigla", value: "acronym" },
                { text: "Nome", value: "name" },
                { text: "Ações", value: "actions", sortable: false },
            ],

            platforms: [],
            icons: [],

            dialogCreate: {
                active: false,
                platform: {
                    name: "",
                    acronym: "",
                    icon: ""
                },
                message: ""
            }
        }
    },

    created() {
        this.loadIcons();
        this.loadPlatforms();
    },

    methods: {
        loadIcons() {
            this.$api.get("/platforms/icons").then(res => {
                const data = res.data;
                this.icons = data.data.icons;
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
            this.dialogCreate.platform = {
                name: "",
                acronym: "",
                icon: ""
            }
        },

        addPlatform() {
            this.$api.post("/platforms", this.dialogCreate.platform).then(res => {
                // const data = res.data;
                this.loadPlatforms();
            }).catch(err => {
                console.error(err);
            });
        }
    },
});
