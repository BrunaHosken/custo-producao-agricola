<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhuma Cultura criada.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title> Culturas </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="name"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.quantidade`]="{ item }">
            {{ item.quantidade.toLocaleString() }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <CulturasEdit
      :showDialog="editou"
      :formEditou="selected"
      @showDialogClose="close"
    />

    <AppFloatingButton
      v-show="true"
      :itensLength="selected.length"
      @edicao="edicaoItens"
      @deletou="deletouItens"
    />
  </v-layout>
</template>

<script>
import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import CulturasEdit from "./CulturasEdit.vue";
export default {
  name: "Culturas",
  components: {
    AppFloatingButton,
    CulturasEdit,
  },
  mixins: [formatCurrentMixin],

  data() {
    return {
      formEditou: {
        index: 0,
        descricao: "",
        quantidade: 0,
        tipo: "Maço",
      },

      selected: [],
      headers: [
        {
          text: "Cultura",
          align: "start",

          value: "name",
        },
        { text: "Quantidade estimada por Hectare", value: "quantidade" },
        { text: "Unidade", value: "unidade" },
      ],
      produtos: [
        {
          index: 1,
          name: "Crisântemo",
          quantidade: 14000,
          unidade: "Maço",
        },
      ],

      editou: false,
      deletou: false,
    };
  },

  methods: {
    close(item) {
      this.editou = item;
    },
    edicaoItens(item) {
      this.editou = item;
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
