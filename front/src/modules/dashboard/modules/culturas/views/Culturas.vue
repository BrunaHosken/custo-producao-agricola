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
          item-key="id"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
          multi-sort
        >
          <template v-slot:[`item.quantidade`]="{ item }">
            {{ item.quantidade.toLocaleString() }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <SnackBar
      :show="createWithError"
      :mensagem="this.mensagem"
      color="red"
      @show="showSnackBarError"
    />

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
import culturaService from "./../services/cultura-service";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import CulturasEdit from "./CulturasEdit.vue";
import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "Culturas",
  components: {
    AppFloatingButton,
    CulturasEdit,
    SnackBar,
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

          value: "DescrCultura",
        },
        {
          text: "Quantidade estimada por Hectare",
          value: "QtdEstimadaPorHectare",
        },
        { text: "Unidade", value: "Und" },
      ],
      produtos: [],
      mensagem: "",
      createWithError: false,
      editou: false,
      deletou: false,
    };
  },
  async created() {
    this.produtos = await culturaService.cultura();
  },
  methods: {
    showSnackBarError(data) {
      this.createWithError = data;
    },
    close(item) {
      this.editou = item;
    },
    edicaoItens(item) {
      this.editou = item;
    },
    async deletouItens(item) {
      try {
        await culturaService.DeleteCultura(this.selected);
      } catch (e) {
        this.mensagem = e.message;
        this.createWithError = true;
      } finally {
        this.deletou = item;
      }
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
