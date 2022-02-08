<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm7 md5 lg4 xl4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Custo Produção Agrícola
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ texts.toolbar }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-spacer></v-spacer>
            <v-progress-circular
              v-show="isLoading"
              indeterminate
              color="white"
              width="1"
            ></v-progress-circular>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-if="!isLogin && !isForgot"
                v-model="user.name"
                prepend-inner-icon="mdi-account"
                name="name"
                label="Nome"
                type="text"
                :error-messages="nameErrors"
                :success="!$v.user.name.$invalid"
                v-model.trim="$v.user.name.$model"
              ></v-text-field>
              <v-text-field
                v-model="user.email"
                prepend-inner-icon="mdi-email"
                name="email"
                label="Email"
                type="email"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
                v-model.trim="$v.user.email.$model"
              ></v-text-field>
              <v-text-field
                v-model="user.password"
                prepend-inner-icon="mdi-lock"
                name="password"
                label="Senha"
                type="password"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                v-model.trim="$v.user.password.$model"
              ></v-text-field>
            </v-form>
            <v-btn block depressed color="secondary" @click="newUser">
              {{ texts.button }}
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-show="isLogin && !isForgot"
              color="primary"
              text
              class="ml-2"
              @click="forgotPassword"
            >
              Esqueci a senha
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              :disabled="$v.$invalid"
              color="primary"
              large
              @click="submit"
              class="mr-2 mb-2"
            >
              {{ texts.toolbar }}
            </v-btn>
          </v-card-actions>
          <v-snackbar v-model="showSnackBar" top rounded="pill">
            {{ error }}
            <template v-slot:action="{ attrs }">
              <v-btn color="red" text v-bind="attrs">
                <v-icon>close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

//
<script>
import { required, email, minLength } from "vuelidate/lib/validators";
// import AuthService from "./../services/auth-service";
// import { formatError } from "@/utils";

export default {
  name: "Login",
  data: () => ({
    isLogin: true,
    isLoading: false,
    error: undefined,
    showSnackBar: false,
    user: {
      name: "",
      email: "",
      password: "",
    },
    isForgot: false,
  }),

  validations() {
    const validators = {
      user: {
        email: {
          required,
          email,
        },
        password: {
          required,
          minLength: minLength(6),
        },
      },
    };
    if (this.isLogin) {
      return validators;
    }
    return {
      user: {
        ...validators.user,
        name: {
          required,
          minLength: minLength(2),
        },
      },
    };
  },
  computed: {
    texts() {
      if (this.isLogin) return { toolbar: "Entrar", button: "Criar conta" };
      if (this.isForgot && !this.isLogin)
        return { toolbar: "Nova Senha", button: "Já tenho uma conta" };
      return { toolbar: "Criar Conta", button: "Já tenho uma conta" };
    },

    emailErrors() {
      const errors = [];
      const email = this.$v.user.email;
      if (!email.$dirty) {
        return errors;
      }
      !email.required && errors.push("Email é obrigatório!");
      !email.email && errors.push("Insira um email valido!");
      return errors;
    },
    nameErrors() {
      const errors = [];
      const name = this.$v.user.name;
      if (!name.$dirty) {
        return errors;
      }
      !name.required && errors.push("Nome é obrigatório!");
      !name.minLength &&
        errors.push(
          `Insira pelo menos ${name.$params.minLength.min} caracteres!`
        );
      return errors;
    },
    passwordErrors() {
      const errors = [];
      const password = this.$v.user.password;
      if (!password.$dirty) {
        return errors;
      }
      !password.required && errors.push("Senha é obrigatória!");
      !password.minLength &&
        errors.push(
          `Insira pelo menos ${password.$params.minLength.min} caracteres!`
        );
      return errors;
    },
  },
  methods: {
    forgotPassword() {
      this.isForgot = !this.isForgot;
      this.isLogin = !this.isLogin;
    },
    newUser() {
      this.isForgot = false;
      this.isLogin = !this.isLogin;
    },
    submit() {
      console.log(this.user);
      this.$router.push("/dashboard");
    },
    //   async submit() {
    //     this.isLoading = true;
    //     try {
    //       this.isLogin
    //         ? await AuthService.login(this.user)
    //         : await AuthService.signup(this.user);

    //       this.$router.push(this.$route.query.redirect || "/dashboard");
    //     } catch (error) {
    //       this.error = formatError(error.message);
    //       this.showSnackBar = true;
    //     } finally {
    //       this.isLoading = false;
    //     }
  },
};
</script>
