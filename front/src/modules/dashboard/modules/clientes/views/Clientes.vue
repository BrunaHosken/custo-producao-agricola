<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhum Cliente criado.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Clientes
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="nome"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
        </v-data-table>
      </v-card>
    </v-flex>

    <ClientesEditNew
      :showDialog="cliente"
      :formEditou="selected"
      :editou="editou"
      @showDialogClose="close"
    />

    <AppFloatingButton
      v-show="true"
      :itensLength="selected.length"
      @register="novoItem"
      @edicao="edicaoItens"
      @deletou="deletouItens"
    />
  </v-layout>
</template>

<script>
import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import ClientesEditNew from "./ClientesEditNew.vue";
export default {
  name: "Despesas",
  components: {
    AppFloatingButton,
    ClientesEditNew,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      selected: [],
      headers: [
        {
          text: "Clientes",
          align: "start",

          value: "nome",
        },
      ],
      produtos: [
        {
          index: 1,
          nome: "Feira",
        },
        {
          index: 2,
          nome: "Floricultura do Seu João",
        },
        {
          index: 3,
          nome: "Floricultura do Seu João 1",
        },
        {
          index: 4,
          nome: "Floricultura do Seu João 2",
        },
      ],
      cliente: false,
      editou: false,
      deletou: false,
    };
  },

  methods: {
    novoItem() {
      this.cliente = true;
      this.editou = false;
    },
    close(item) {
      this.cliente = item;
    },
    edicaoItens(item) {
      this.cliente = item;
      this.editou = true;
    },
    deletouItens(item) {
      this.deletou = item;
      console.log(this.deletou);
    },
  },
};
</script>

<style>
h3 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
}
</style>
