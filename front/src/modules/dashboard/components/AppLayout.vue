<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />
    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>
    <AppFloatingButton v-show="!isShow" />
  </div>
</template>

<script>
import AppMenu from "./AppMenu.vue";
import AppToolbar from "./AppToolbar.vue";
import AppFloatingButton from "./../modules/components/AppFloatingButton.vue";

export default {
  name: "AppLayout",
  components: {
    AppToolbar,
    AppMenu,
    AppFloatingButton,
  },
  data: () => ({
    drawer: false,
  }),
  computed: {
    isShow() {
      return (
        this.$route.path === "/dashboard" ||
        this.$route.path === "/dashboard/contatos" ||
        this.$route.path === "/dashboard/configuracoes" ||
        this.$route.path === "/dashboard/margem-bruta" ||
        this.$route.path === "/dashboard/controle-estoque" ||
        this.$route.path === "/dashboard/relatorios"
      );
    },
  },
};
</script>
