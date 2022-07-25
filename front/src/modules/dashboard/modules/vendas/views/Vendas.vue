<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth
        class="mt-5 mb-3"
        format="MM-YYYY"
        month="02"
        @period="period"
        @date="date"
      />
      <TotalBalance class="mt-5 mb-3" :value="value" />
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
          item-key="id"
          :search="searchTable"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
          multi-sort
        >
          <template v-slot:[`item.Venda.Data`]="{ item }">
            {{ formatDateTable(item.Venda.Data) }}
          </template>
          <template v-slot:[`item.PrecoUnit`]="{ item }">
            {{ formatCurrency(item.PrecoUnit) }}
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ formatCurrency(item.total) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <VendasEdit
      :showDialog="editou"
      :formEditou="selected"
      @showDialogClose="close"
    />
    <SnackBar
      :show="createSnackBar"
      :mensagem="this.mensagem"
      :color="color"
      @show="showSnackBar"
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
import vendasService from "./../services/vendasService";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import TotalBalance from "./../../components/TotalBalance.vue";
import SnackBar from "./../../../components/SnackBar.vue";

export default {
  name: "Vendas",
  components: {
    AppFloatingButton,
    VendasEdit,
    ToolbarByMonth,
    TotalBalance,
    SnackBar,
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
          value: "CulturaDesenvolvida.Cultura.DescrCultura",
        },
        { text: "Data da Venda", value: "Venda.Data" },
        { text: "Cliente", value: "Venda.Cliente.NomeCliente" },

        { text: "Quantidade Vendida", align: "center", value: "Qtd" },
        { text: "Preço Unitário", value: "PrecoUnit" },
        { text: "Unidade", value: "Und" },
        { text: "Total", value: "total" },
      ],
      produtos: [],
      total: 0,
      totalAnual: 0,
      produtosEdicao: [],
      editou: false,
      deletou: false,
      periodoAtual: "",
      currentDate: "",
      createSnackBar: false,
      mensagem: "",
      color: "success",
    };
  },
  computed: {
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.total;
      }, 0);
    },
  },
  methods: {
    showSnackBar(data) {
      this.createSnackBar = data;
    },
    async searchSales() {
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      this.produtos = await vendasService.vendas(variables);
    },
    period(pValue) {
      this.periodoAtual = pValue;
    },
    async date(pValue) {
      this.currentDate = pValue;
      this.searchSales();
    },
    close(item) {
      this.editou = item;
    },
    formatDateTable(value) {
      return moment(value.substr(0, 10)).format("DD/MM/YYYY");
    },

    edicaoItens(item) {
      this.editou = item;
    },

    async deletouItens(item) {
      try {
        await vendasService.deleteVendaItem(this.selected);
        this.$router.go(-1);
        this.createSnackBar = true;
        this.mensagem = "Despesa criada com sucesso!";
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      } finally {
        this.deletou = item;
      }
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
