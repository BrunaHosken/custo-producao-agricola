<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    temporary
    app
  >
    <v-list>
      <v-list-item tag="div">
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>

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
        <div v-for="item in items" :key="item.title">
          <v-list-item
            v-if="!item.subLinks"
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

          <v-list-group
            v-else
            :key="item.title"
            no-action
            :prepend-icon="item.icon"
            :value="false"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="sublink in item.subLinks"
              :to="sublink.url"
              :key="sublink.title"
              :exact="sublink.exact"
              @click.stop="$emit('input', false)"
            >
              <v-list-item-action>
                <v-icon>{{ sublink.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ sublink.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </div>
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
        title: "Contatos",
        icon: "mdi-human-greeting-proximity",
        url: "/dashboard/contatos",
        exact: true,
      },
      {
        title: "Despesas",
        icon: "mdi-cash-remove",
        url: "/dashboard/despesas",
        exact: true,
      },
      {
        icon: "mdi-cash-multiple",
        title: "Custo de Produção",
        subLinks: [
          {
            title: "Culturas",
            icon: "mdi-flower-tulip",
            url: "/dashboard/culturas",
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
            title: "Cultura Desenvolvida",
            icon: "mdi-cash-multiple",
            url: "/dashboard/custo-producao",
            exact: true,
          },
        ],
      },
      {
        icon: "mdi-cash-plus",
        title: "Vendas da Produção",
        subLinks: [
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
        ],
      },

      {
        title: "Margem Bruta",
        icon: "mdi-finance",
        url: "/dashboard/margem-bruta",
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
    ],
    mini: false,
    user: {},
  }),
  // async created() {
  //   this.user = await AuthService.user();
  // },
};
</script>
