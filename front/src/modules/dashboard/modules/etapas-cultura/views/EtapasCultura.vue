<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth class="mt-5 mb-3" format="MM-YYYY" month="02" />

      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhuma Etapa criada.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Etapas da Cultura
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchTable"
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
          item-key="InsumoServiço"
          :search="searchTable"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.data`]="{ item }">
            {{ formatDateTable(item.data) }}
          </template>
          <template v-slot:[`item.valor`]="{ item }">
            {{ formatCurrency(item.valor) }}
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ formatCurrency(calculaTotal(item.quantidade, item.valor)) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <EtapasCulturaEdit
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
import EtapasCulturaEdit from "./EtapasCulturaEdit.vue";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";

export default {
  name: "EtapasCultura",
  components: {
    AppFloatingButton,
    EtapasCulturaEdit,
    ToolbarByMonth,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      searchTable: null,
      selected: [],
      headers: [
        {
          text: "Ordem da Etapa",
          align: "start",
          value: "ordem",
        },
        {
          text: "Descrição",
          value: "descricao",
        },
        { text: "Insumos/Serviços", value: "InsumoServiço" },
        { text: "Tipo do Uso", value: "tipoUso" },
        { text: "Quantidade", value: "quantidade" },
        { text: "Unidade", value: "unidade" },
        { text: "Valor", value: "valor" },
        { text: "Total", value: "total" },
      ],
      produtos: [
        {
          index: 0,
          ordem: "1º",
          descricao: "Sementes ou mudas",
          InsumoServiço: "Mudas enraizadas",
          tipoUso: "Real",
          quantidade: 420,
          unidade: "Milheiro",
          valor: "35",
          total: 0,
        },
        {
          index: 1,
          ordem: "1º",
          descricao: "Adubos e corretivos",
          InsumoServiço: "Adubo foliar fosfatado",
          tipoUso: "Previsto",
          quantidade: 8,
          unidade: "Litros",
          valor: "15",
          total: 0,
        },
        {
          index: 2,
          ordem: "1º",
          descricao: "Defensivos",
          InsumoServiço: "Fungicidas",
          tipoUso: "Real",
          quantidade: 54,
          unidade: "Quilograma/Litro",
          valor: "40",
          total: 0,
        },
        {
          index: 3,
          ordem: "3º",
          descricao: "Defensivos",
          InsumoServiço: "Espalhante adesivo",
          tipoUso: "Real",
          quantidade: 2,
          unidade: "Litros",
          valor: "15",
          total: 0,
        },
        {
          index: 4,
          ordem: "5º",
          descricao: "Serviços",
          InsumoServiço: "Irrigação",
          tipoUso: "Previsto",
          quantidade: 30,
          unidade: "Dias/Homem",
          valor: "15",
          total: 0,
        },
        {
          index: 5,
          ordem: "1º",
          descricao: "Materiais",
          InsumoServiço: "Fitilho",
          tipoUso: "Real",
          quantidade: 14,
          unidade: "Quilograma",
          valor: "6",
          total: 0,
        },
      ],
      total: 0,
      totalAnual: 0,
      produtosEdicao: [],
      editou: false,
      deletou: false,
    };
  },
  computed: {
    // value() {
    //   return this.produtos.reduce((a, b) => {
    //     return a + b.preco * b.vendida;
    //   }, 0);
    // },
  },
  methods: {
    close(item) {
      this.editou = item;
    },
    formatDateTable(value) {
      return moment(value).format("DD/MM/YYYY");
    },

    edicaoItens(item) {
      this.editou = item;
    },
    deletouItens(item) {
      this.deletou = item;
      console.log(this.deletou);
    },
    calculaTotal(quantidade, valor) {
      return quantidade * valor;
    },

    calculaTotalAnual() {
      return this.produtos.reduce((a, b) => {
        return b.tipo === "Fixo" ? a + b.valor * 12 : a;
      }, 0);
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
