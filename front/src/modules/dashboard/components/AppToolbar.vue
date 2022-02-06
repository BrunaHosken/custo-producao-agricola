<template>
  <v-app-bar fixed color="primary" app>
    <v-app-bar-nav-icon @click.stop="$emit('hide', !show)"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ titleCases || "Dashboard" }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn icon @click="showLogoutDialog = true" title="Sair">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-toolbar-items>
    <Dialog
      message="Deseja realmente sair?"
      :showDialog="showLogoutDialog"
      @option="option"
    />
  </v-app-bar>
</template>
<script>
// import { mapState } from "vuex";
// import apollo, { onLogout } from "./../../../plugins/apollo";
import Dialog from "./Dialog.vue";
export default {
  name: "AppToolbar",
  components: {
    Dialog,
  },
  props: {
    show: Boolean,
  },
  model: {
    prop: "show",
    event: "hide",
  },
  data() {
    return {
      showLogoutDialog: false,
      title: "",
    };
    // title: "",
  },
  computed: {
    titleCases() {
      switch (this.$route.path) {
        case "/dashboard/configuracoes":
          return "Configurações";
        case "/dashboard/despesas":
          return "Despesas";
        case "/dashboard/culturas":
          return "Culturas";
        case "/dashboard/custo-producao":
          return "Custo de Produção";
        case "/dashboard/etapas-culturas":
          return "Etapas da Cultura";
        case "/dashboard/insumos":
          return "Insumos";
        case "/dashboard/servicos":
          return "Serviços";
        case "/dashboard/margem-bruta":
          return "Margem Bruta";
        case "/dashboard/vendas":
          return "Vendas";
        case "/dashboard/clientes":
          return "Clientes";
        case "/dashboard/controle-estoque":
          return "Controle de Estoque";
        case "/dashboard/relatorios":
          return "Relatórios";
        case "/dashboard/contatos":
          return "Contatos";

        default:
          return "Dashboard";
      }
    },
  },
  // computed: {
  //   ...mapState(["title"]),
  // },
  methods: {
    option(data) {
      if (data == "nao") {
        this.showLogoutDialog = false;
      } else {
        this.$router.push("/login");
        this.showLogoutDialog = false;
      }
    },
  },
};
</script>
