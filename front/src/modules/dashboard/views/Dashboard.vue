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
        <p>
          Aqui você pode criar seu próprio custo de produção, além de
          administrar suas vendas, despesas, relatórios, margem bruta e controle
          de estoque das culturas!
        </p>
        <p>
          <v-icon>mdi-chevron-left</v-icon>
          Para começar, escolha uma das opções clicando no menu lateral.
        </p>
      </v-card-subtitle>
      <v-card-text class="text-h6 mb-1">
        <p>
          Em algumas telas você poderá adicionar, remover ou editar algum
          registro.
        </p>
        <p>
          Para saber em quais telas essas ações serão possíveis, um menu
          suspenso na direita inferior da tela será apresentado com a seguinte
          figura &nbsp;
          <v-btn fab small color="primary">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          .
        </p>

        <p>
          Para adicionar um novo registro, abra o menu e clique em
          <v-btn fab small color="success">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
          . Uma nova tela será aberta para o cadastro do novo registro.
        </p>

        <p>
          Para editar um novo registro, clique no item desejado, abra o menu e
          clique em
          <v-btn fab small color="warning">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          . Uma nova tela com os dados do item para edição será aberta.
        </p>
        <p>
          Para remover um novo registro, clique no item desejado, abra o menu e
          clique em
          <v-btn fab small color="red accent-2">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
          . Um alerta perguntando se deseja realmente excluir será aberto.
        </p>
        <p>Clique em <i>SIM</i> para que o registro seja excluido</p>
        <p>
          Clique em <i>NÃO</i> para que o alerta se feche e a ação seja
          cancelada
        </p>
        <p>
          Para fechar o menu suspenso basta clicar em &nbsp;
          <v-btn fab small color="red accent-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </p>
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
<style lang="scss">
.v-card__title,
.v-card__subtitle,
.v-card__text {
  word-break: normal;
  text-align: justify;
}

.v-btn--icon.v-size--small .v-icon,
.v-btn--fab.v-size--small .v-icon {
  cursor: auto;
}
</style>
