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
            Dados do usuário
          </v-list-item-title>
          <v-list-item-subtitle>
            <p>Nome: {{ user.nome }}</p>
            <p>Email: {{ user.email }}</p>
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
          <v-list-item-subtitle class="mb-2">
            <v-text-field
              :error-messages="nameErrors"
              :success="!$v.user.nome.$invalid"
              v-model.trim="$v.user.nome.$model"
              name="name"
              label="Nome"
              type="text"
            ></v-text-field>

            <v-text-field
              :error-messages="emailErrors"
              :success="!$v.user.email.$invalid"
              v-model.trim="$v.user.email.$model"
              name="email"
              label="Email"
              type="email"
            ></v-text-field>

            <v-text-field
              :error-messages="senhaErrors"
              :success="!$v.user.senha.$invalid"
              v-model.trim="$v.user.senha.$model"
              name="password"
              label="Senha"
              type="password"
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
            :disabled="user.senha === ''"
            color="success"
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
  </v-card>
</template>

<script>
import Dialog from "./../../../components/Dialog.vue";

import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  name: "Configuracoes",
  components: {
    Dialog,
  },
  data() {
    return {
      user: {
        nome: "Teste",
        email: "teste@email.com",
        senha: "",
      },
      editUser: false,
      showClearDialog: false,
      showDeleteDialog: false,
    };
  },
  validations() {
    return {
      user: {
        nome: {
          required,
          minLength: minLength(2),
        },
        email: {
          required,
          email,
        },
        senha: {
          required,
          minLength: minLength(6),
        },
      },
    };
  },

  computed: {
    nameErrors() {
      const errors = [];
      const nome = this.$v.user.nome;
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
    senhaErrors() {
      const errors = [];
      const senha = this.$v.user.senha;
      if (!senha.$dirty) {
        return errors;
      }
      !senha.required && errors.push("Senha é obrigatória!");
      !senha.minLength &&
        errors.push(
          `Insira pelo menos ${senha.$params.minLength.min} caracteres!`
        );
      return errors;
    },
  },
  methods: {
    buttonEditUser() {
      this.editUser = true;
      this.user.senha = "";
    },
    save() {
      this.editUser = false;
      this.$v.$reset();
    },
    clear() {
      this.user = {
        nome: "",
        email: "",
        senha: "",
      };
    },
    cancel() {
      this.editUser = false;
      this.user = {
        nome: "Teste",
        email: "teste@email.com",
        senha: "",
      };
    },
    option(data) {
      if (data == "nao") {
        if (this.showClearDialog) this.showClearDialog = false;
        this.showDeleteDialog = false;
      } else {
        if (this.showClearDialog) {
          this.clear();
          this.showClearDialog = false;
        } else {
          console.log("conta deletada");
          this.$router.push("/login");
        }
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
