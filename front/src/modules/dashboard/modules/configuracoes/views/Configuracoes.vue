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
            <p>Nome:{{ user.nome }}</p>
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
          <v-btn
            v-show="!editUser"
            color="warning"
            @click="editUser = !editUser"
          >
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
              v-model.lazy="user.nome"
              name="name"
              label="Nome"
              type="text"
            ></v-text-field>

            <v-text-field
              v-model.lazy="user.email"
              name="email"
              label="Email"
              type="email"
            ></v-text-field>

            <v-text-field
              v-model="user.senha"
              name="password"
              label="Senha"
              type="password"
            ></v-text-field>
          </v-list-item-subtitle>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-show="editUser"
            color="secondary"
            @click="editUser = !editUser"
          >
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

  computed: {},
  methods: {
    save() {
      console.log(this.user);
      this.editUser = false;
    },

    option(data) {
      if (data == "nao") {
        if (this.showClearDialog) this.showClearDialog = false;
        this.showDeleteDialog = false;
      } else {
        if (this.showClearDialog) {
          this.user = {
            nome: "",
            email: "",
            senha: "",
          };
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
