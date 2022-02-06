<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    temporary
    app
  >
    <v-list>
      <v-list-item tag="div">
        <!-- <v-list-item-avatar> -->
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>
        <!-- </v-list-item-avatar> -->

        <v-list-item-content>
          <v-list-item-title>Teste</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon>
            <v-icon @click.stop="$emit('input', false)">mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-list class="pt-0" dense>
        <v-divider light></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.url"
          :exact="item.exact"
          @click.stop="$emit('input', false)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// import AuthService from "./../../auth/services/auth-service";
export default {
  name: "AppMenu",
  props: {
    value: Boolean,
  },
  data: () => ({
    items: [
      // { title: "Home", icon: "mdi-home", url: "/dashboard", exact: true },
      {
        title: "Configurações",
        icon: "mdi-cog-outline",
        url: "/dashboard/configuracoes",
        exact: true,
      },
      {
        title: "Despesas",
        icon: "mdi-cash-remove",
        url: "/dashboard/despesas",
        exact: true,
      },
      {
        title: "Culturas",
        icon: "mdi-flower-tulip",
        url: "/dashboard/culturas",
        exact: true,
      },
      {
        title: "Custo de Produção",
        icon: "mdi-cash-multiple",
        url: "/dashboard/custo-producao",
        exact: true,
      },

      {
        title: "Etapas da Cultura",
        icon: "mdi-sitemap-outline",
        url: "/dashboard/etapas-culturas",
        exact: true,
      },
      {
        title: "Insumos",
        icon: "mdi-barley",
        url: "/dashboard/insumos",
        exact: true,
      },
      {
        title: "Serviços",
        icon: "mdi-account-tie",
        url: "/dashboard/servicos",
        exact: true,
      },
      {
        title: "Margem Bruta",
        icon: "mdi-finance",
        url: "/dashboard/margem-bruta",
        exact: true,
      },
      {
        title: "Vendas",
        icon: "mdi-cash-plus",
        url: "/dashboard/vendas",
        exact: true,
      },
      {
        title: "Clientes",
        icon: "mdi-account-group-outline",
        url: "/dashboard/clientes",
        exact: true,
      },
      {
        title: "Controle de Estoque",
        icon: "mdi-card-bulleted-outline",
        url: "/dashboard/controle-estoque",
        exact: true,
      },
      {
        title: "Relatórios",
        icon: "mdi-chart-bar-stacked",
        url: "/dashboard/relatorios",
        exact: true,
      },
      {
        title: "Contatos",
        icon: "mdi-human-greeting-proximity",
        url: "/dashboard/contatos",
        exact: true,
      },
    ],
    mini: false,
    user: {},
  }),
  // async created() {
  //   this.user = await AuthService.user();
  // },
};
</script>
