const registerPage = Vue.component("Register", {
    template: /* html */
        `<v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Register</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-alert :value="alert.show" :type="alert.type" dismissible @input="alert.show = $event">{{ alert.message }}</v-alert>
                        <v-text-field v-model="username" label="Username" name="username" prepend-icon="mdi-account" type="text" />
                        <v-text-field v-model="password" id="password" label="Password" name="password" prepend-icon="mdi-lock" type="password" />
                        <v-text-field v-model="repeatPassword" id="repeatPassword" label="Re-type Password" name="repeatPassword" prepend-icon="mdi-lock" type="password" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" block @click="register">Register</v-btn>
                    </v-card-actions>
                </v-card>
                
                <div class="mt-5 text-center">
                    <span>
                        <span>Login</span>
                        <router-link :to="{ name: 'Login' }">here</router-link>
                    </span>
                </div>
            </v-col>
        </v-row>
    </v-container>`,

    data() {
        return {
            username: "",
            password: "",
            repeatPassword: "",
            alert: {
                show: false,
                type: "error",
                message: ''
            }
        }
    },

    mounted() {

    },

    methods: {
        isValidRegister() {
            if (!this.username || !this.password || !this.repeatPassword) return false;
            if (this.password !== this.repeatPassword) return false;
            return true;
        },

        register() {
            if (!this.isValidRegister()) {
                this.alert = {
                    show: true,
                    type: "error",
                    message: "Invalid Data"
                }
                return;
            }

            this.$api.post("/auth/register", {
                "username": this.username,
                "password": this.password
            }).then(res => {
                const data = res.data;

                if (data.success) {
                    this.alert = {
                        show: true,
                        type: "success",
                        message: "Registered, you can make login now"
                    }

                    this.username = "";
                    this.password = "";
                    this.repeatPassword = "";
                } else {
                    this.alert = {
                        show: true,
                        type: "error",
                        message: data.message
                    }
                    this.password = "";
                    this.repeatPassword = "";
                }
            }).catch(err => {
                this.alert = {
                    show: true,
                    type: "error",
                    message: "Something went wrong"
                }
                this.password = "";
                this.repeatPassword = "";
            });
        }
    },
});
