<template>
  <AppLayout>
    <v-card
      v-show="this.$route.path === '/dashboard'"
      class="mx-auto"
      outlined
      shaped
    >
      <v-card-title class="text-h4 mb-3 mt-1 no-break">
        Bem vindo ao seu Gerenciador de Custo de Produção!!!
      </v-card-title>
      <v-card-subtitle class="text-h6">
        Aqui você pode criar seu próprio custo de produção, além de administrar
        suas vendas, despesas, relatórios, margem bruta e controle de estoque
        das culturas!
      </v-card-subtitle>
      <v-card-text class="text-h6 mb-1">
        <v-icon>mdi-chevron-left</v-icon>
        Para começar, escolha uma das opções clicando no menu lateral.
      </v-card-text>
    </v-card>
    <router-view />
  </AppLayout>
</template>

<script>
// import { registerVuexModule } from "./../../../utils";
// import financesStore from "./../modules/finances/store";
import AppLayout from "./../components/AppLayout.vue";

export default {
  name: "Dashboard",
  components: {
    AppLayout,
  },

  // created() {
  //   registerVuexModule(this.$store, "finances", financesStore);
  // },
};
</script>
<style>
.v-card__title,
.v-card__subtitle,
.v-card__text {
  word-break: normal;
  text-align: justify;
}
</style>
