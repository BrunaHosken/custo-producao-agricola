<template>
  <v-card flat elevation="24" outlined>
    <v-list-item>
      <div :class="editUser ? 'avatar-edit' : 'avatar'">
        <v-list-item-avatar tile size="80">
          <v-icon size="80">mdi-account</v-icon>
        </v-list-item-avatar>
      </div>
      <v-list-item-content>
        <div class="dados" v-show="!editUser">
          <v-list-item-title class="text-h5 mb-1">
            Dados do Usuário
          </v-list-item-title>
          <v-list-item-subtitle>
            <p>Nome: {{ user.Nome }}</p>
            <p>Email: {{ user.Email }}</p>
          </v-list-item-subtitle>
        </div>
        <div class="tema" v-show="!editUser">
          <v-list-item-title class="text-h5">
            Tema da página
          </v-list-item-title>
          <v-list-item-subtitle class="mb-2">
            <v-toolbar flat height="72">
              <v-switch
                v-model="$vuetify.theme.dark"
                hint="Clique para mudar o tema do site"
                inset
                :label="$vuetify.theme.dark ? 'Escuro' : 'Claro'"
                persistent-hint
              >
              </v-switch>
            </v-toolbar>
          </v-list-item-subtitle>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-show="!editUser" color="warning" @click="buttonEditUser">
            Modificar Usuário
          </v-btn>

          <v-btn
            v-show="!editUser"
            color="error"
            @click="showDeleteDialog = true"
          >
            <v-icon>mdi-alert</v-icon>
            &nbsp;Excluir Conta do Usuário
          </v-btn>
        </v-card-actions>
        <div class="edit-user" v-show="editUser">
          <v-list-item-title class="text-h5">
            Modificar Usuário
          </v-list-item-title>
          <v-list-item-subtitle class="mt-1">
            <v-text-field
              prepend-inner-icon="mdi-account"
              :error-messages="nameErrors"
              :success="!$v.user.Nome.$invalid"
              v-model="$v.user.Nome.$model"
              name="name"
              label="Nome"
              type="text"
            ></v-text-field>

            <v-text-field
              v-model="user.Email"
              prepend-inner-icon="mdi-email"
              name="email"
              label="Email"
              type="email"
              disabled
            ></v-text-field>
            <v-text-field
              v-model.trim="$v.user.Senha.$model"
              prepend-inner-icon="mdi-lock"
              name="password"
              label="Senha"
              :error-messages="senhaErrors"
              :success="!$v.user.Senha.$invalid"
            ></v-text-field>
          </v-list-item-subtitle>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-show="editUser" color="secondary" @click="cancel">
            Cancelar
          </v-btn>
          <v-btn
            v-show="editUser"
            color="orange accent-4k"
            @click="showClearDialog = true"
          >
            Limpar
          </v-btn>
          <v-btn
            v-show="editUser"
            color="success"
            :disabled="$v.$invalid"
            @click="save"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-list-item-content>
    </v-list-item>
    <Dialog
      :message="
        showClearDialog
          ? 'Deseja realmente limpar os dados?'
          : 'Deseja realmente excluir a conta do produtor?'
      "
      :showDialog="showClearDialog || showDeleteDialog"
      @option="option"
    />
    <SnackBar
      :show="createSnackBar"
      :mensagem="this.mensagem"
      :color="color"
      @show="showSnackBar"
    />
  </v-card>
</template>

<script>
import Dialog from "./../../../components/Dialog.vue";
import AuthService from "./../../../../auth/services/auth-service";
import { required, minLength } from "vuelidate/lib/validators";
import configuracoesService from "./../services/configuracoes-service";
import SnackBar from "./../../../components/SnackBar.vue";
import apollo, { onLogout } from "./../../../../../plugins/apollo";
export default {
  name: "Configuracoes",
  components: {
    Dialog,
    SnackBar,
  },
  data() {
    return {
      user: {},
      editUser: false,
      showClearDialog: false,
      showDeleteDialog: false,
      createSnackBar: false,
      mensagem: "",
      color: "success",
    };
  },
  validations() {
    return {
      user: {
        Nome: {
          required,
          minLength: minLength(2),
        },

        Senha: {
          required,
          minLength: minLength(6),
        },
      },
    };
  },
  created() {
    this.user = AuthService.agricultor().subscribe(
      (user) => (this.user = user)
    );
  },
  computed: {
    nameErrors() {
      const errors = [];
      const nome = this.$v.user.Nome;
      if (!nome.$dirty) {
        return errors;
      }
      !nome.required && errors.push("Nome é obrigatório!");
      !nome.minLength &&
        errors.push(
          `Insira pelo menos ${nome.$params.minLength.min} caracteres!`
        );
      return errors;
    },

    senhaErrors() {
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
  },
  methods: {
    showSnackBar(data) {
      this.createSnackBar = data;
    },
    buttonEditUser() {
      this.editUser = true;
      this.$v.$reset();
      this.user.Senha = "";
    },
    async save() {
      try {
        await configuracoesService.UpdateAgricultor(this.user);
        this.editUser = false;
        this.$v.$reset();
        this.createSnackBar = true;
        this.mensagem =
          "Conta alterada com sucesso. Lembre-se de no próximo Login utilizar essa nova senha!";
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      }
    },
    clear() {
      AuthService.agricultor().subscribe((user) => (this.user = user));
      this.user.Senha = "";
    },
    async cancel() {
      this.editUser = false;
      this.clear();
      this.$v.$reset();
    },
    async option(data) {
      try {
        if (data == "nao") {
          if (this.showClearDialog) this.showClearDialog = false;
          this.showDeleteDialog = false;
        } else {
          if (this.showClearDialog) {
            this.clear();
            this.showClearDialog = false;
          } else {
            await configuracoesService.DeleteAgricultor(this.user);
            await onLogout(apollo);
            this.createSnackBar = true;
            this.mensagem = "Conta deletada com sucesso!";
            this.$router.push("/login");
          }
        }
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      }
    },
  },
};
</script>

<style>
.avatar {
  height: 18rem;
}
.avatar-edit {
  height: 19.5rem;
}
.v-card__actions {
  padding: 0;
}
</style>
