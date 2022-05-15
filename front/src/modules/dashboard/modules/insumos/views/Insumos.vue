<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhum Insumo criado.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Insumos
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="id"
          :search="search"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
          multi-sort
        >
          <template v-slot:[`item.PrecoUnit`]="{ item }">
            {{ formatCurrency(item.PrecoUnit) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <InsumosEdit
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
import insumoService from "./../services/insumo-services";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import InsumosEdit from "./InsumosEdit.vue";
export default {
  name: "Insumos",
  components: {
    AppFloatingButton,
    InsumosEdit,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      search: "",
      selected: [],
      headers: [
        {
          text: "Insumo",
          align: "start",

          value: "DescrInsumo",
        },
        { text: "Tipo", value: "TipoInsumo.NomeTipo" },
        { text: "Unidade", value: "Und" },

        { text: "Preço Unitário", value: "PrecoUnit" },
      ],
      produtos: [],
      produtosEdicao: [],
      editou: false,
      deletou: false,
    };
  },

  computed: {
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.valor;
      }, 0);
    },
  },
  async created() {
    console.log("oi");
    this.produtos = await insumoService.insumos();
    console.log(this.produtos);
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
