<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhuma Venda criada.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Vendas
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

    <VendasEdit
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
import VendasEdit from "./VendasEdit.vue";

export default {
  name: "Vendas",
  components: {
    AppFloatingButton,
    VendasEdit,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      searchTable: null,
      selected: [],
      headers: [
        {
          text: "Produto",
          align: "start",
          sortable: false,
          value: "produto",
        },
        { text: "Data da Venda", value: "data" },
        { text: "Cliente", value: "cliente" },

        { text: "Quantidade Vendida", value: "vendida" },
        { text: "Preço Unitário", value: "preco" },
        { text: "Unidade", value: "unidade" },
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
