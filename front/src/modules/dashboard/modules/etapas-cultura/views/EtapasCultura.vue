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
          item-key="produto"
          :search="searchTable"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.data`]="{ item }">
            {{ formatDateTable(item.data) }}
          </template>
          <template v-slot:[`item.vendida`]="{ item }">
            {{ item.vendida.toLocaleString() }}
          </template>
          <template v-slot:[`item.preco`]="{ item }">
            {{ formatCurrency(item.preco) }}
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ formatCurrency(calculaTotal(item.preco, item.vendida)) }}
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
          text: "Descrição",
          align: "start",
          sortable: false,
          value: "descricao",
        },
        { text: "Ordem da Etapa", value: "ordem" },
        { text: "Mês Início", value: "mesInicio" },
        { text: "Mês Fim", value: "mesFim" },
        { text: "Tipo Etapa", value: "tipoEtapa" },
        { text: "Data", value: "data" },
        { text: "Tipo Insumo", value: "tipoInsumo" },
        { text: "Insumo/Serviço", value: "insumoServico" },
        { text: "Quantidade/Dias por Homem", value: "quantidade" },
        { text: "Valor", value: "valor" },
        { text: "Total", value: "total" },
      ],
      produtos: [
        {
          index: 1,
          produto: "Crisântemo",
          data: moment().format("YYYY-MM-DD"),
          cliente: "Feira",
          vendida: 14000,
          preco: 20,
          unidade: "Maço",
          total: 0,
        },
        {
          index: 2,
          produto: "Gérbera",
          data: moment().format("YYYY-MM-DD"),
          cliente: "Feira",
          vendida: 9000,
          preco: 10,
          unidade: "Maço",
          total: 0,
        },
        {
          index: 3,
          produto: "Limonium",
          data: moment().format("YYYY-MM-DD"),
          cliente: "Floricultura do Seu João",
          vendida: 14500,
          preco: 20,
          unidade: "Maço",
          total: 0,
        },
        {
          index: 4,
          produto: "Rosa",
          data: moment().format("YYYY-MM-DD"),
          cliente: "Floricultura do Seu João",
          vendida: 12250,
          preco: 30,
          unidade: "Maço",
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
    calculaTotal(vendida, total) {
      return vendida * total;
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
