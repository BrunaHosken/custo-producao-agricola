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
                v-if="!isForgot"
                v-model="user.password"
                prepend-inner-icon="mdi-lock"
                name="password"
                label="Senha"
                type="password"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                v-model.trim="$v.user.password.$model"
              ></v-text-field>
              <v-text-field
                v-if="newPassword"
                v-model="user.Senha"
                prepend-inner-icon="mdi-lock"
                name="password"
                label="Nova Senha"
                type="password"
                :error-messages="newPasswordErrors"
                :success="!$v.user.Senha.$invalid"
                v-model.trim="$v.user.Senha.$model"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!newPassword"
              color="primary"
              text
              class="ml-2"
              @click="forgotPassword"
            >
              {{ texts.button }}
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
          <v-snackbar
            v-model="showSnackBar"
            bottom
            right
            :color="color"
            class="mb-4"
          >
            {{ mensagem }}
            <template v-slot:action="{ attrs }">
              <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="showSnackBar = false"
              >
                <v-icon>mdi-close</v-icon>
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
import AuthService from "./../services/auth-service";
import { formatError } from "@/utils";
import emailjs from "emailjs-com";
import ConfigurationService from "./../../dashboard/modules/configuracoes/services/configuracoes-service";
export default {
  name: "Login",
  data: () => ({
    isLogin: true,
    isLoading: false,
    mensagem: undefined,
    showSnackBar: false,
    user: {
      email: "",
      password: "",
      Senha: "",
    },
    isForgot: false,
    newPassword: false,
    color: "red",
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
    if (this.isForgot) {
      return {
        user: {
          email: {
            required,
            email,
          },
        },
      };
    }
    return {
      user: {
        ...validators.user,
        Senha: {
          required,
          minLength: minLength(6),
        },
      },
    };
  },
  computed: {
    texts() {
      if (this.isLogin)
        return { toolbar: "Entrar", button: "Recuperar a senha" };
      if (!this.newPassword)
        return { toolbar: "Nova Senha", button: "Cancelar" };
      return { toolbar: "Cadastrar e Entrar" };
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
    newPasswordErrors() {
      const errors = [];
      const password = this.$v.user.Senha;
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

    async submit() {
      if (this.isLogin) {
        this.isLoading = true;
        try {
          await AuthService.login(this.user);
          this.$router.push(this.$route.query.redirect || "/dashboard");
        } catch (error) {
          this.mensagem = formatError(error.message);
          this.showSnackBar = true;
        } finally {
          this.isLoading = false;
        }
      } else if (this.isForgot) {
        try {
          this.user.Senha = Math.random().toString(36).substring(2, 8);
          await AuthService.UpdateAgricultor(this.user);

          var templateParams = {
            user_mail: this.user.email,
            senha: this.user.Senha,
          };

          emailjs.send(
            "service_yhj9lbt",
            "template_jj8ineb",
            templateParams,
            "pdua2Pm4s61rHySot"
          );
          this.showSnackBar = true;
          this.mensagem = "Nova senha enviada para o email informado!";
          this.isForgot = false;
          this.newPassword = true;
          this.color = "success";
          this.user.password = "";
          this.user.Senha = "";
        } catch (error) {
          this.mensagem = formatError(error.message);
          this.showSnackBar = true;
        }
      } else if (this.newPassword) {
        try {
          const data = await AuthService.login(this.user);
          this.user.Nome = data.agricultor.Nome;
          this.user.id = data.agricultor.id;

          await ConfigurationService.UpdateAgricultor(this.user);
          this.$router
            .push(this.$route.query.redirect || "/dashboard")
            .catch(() => {});
          this.$v.$reset();
          this.isLogin = true;
        } catch (error) {
          this.color = "red";
          this.mensagem = formatError(error.message);
          this.showSnackBar = true;
        }
      }
    },
  },
};
</script>
