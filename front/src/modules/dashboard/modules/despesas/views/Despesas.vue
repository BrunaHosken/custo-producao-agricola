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
      <TotalBalance class="mt-5 mb-3" :value="valuePeriod" />
    </v-flex>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhuma Despesa criada.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Despesas do Mês
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
          item-key="name"
          :search="search"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
          multi-sort
        >
          <template v-slot:[`item.Data`]="{ item }">
            {{ formatDateTable(item.Data) }}
          </template>
          <template v-slot:[`item.Valor`]="{ item }">
            {{ formatCurrency(item.Valor) }}
          </template>
          <template v-slot:[`item.valorPeriodo`]="{ item }">
            {{ formatCurrency(calculaValorPeriodo(item)) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <DespesasEdit
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
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import moment from "moment";
import DespesasEdit from "./DespesasEdit.vue";
import despesasService from "./../services/despesa-service.js";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import TotalBalance from "./../../components/TotalBalance.vue";

export default {
  name: "Despesas",
  components: {
    ToolbarByMonth,
    DespesasEdit,
    AppFloatingButton,
    TotalBalance,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      search: "",
      selected: [],
      headers: [
        {
          text: "Despesa",
          align: "start",

          value: "DescrDetalhada",
        },
        { text: "Tipo", value: "TipoDespesa.DescrTipoDespesa" },
        { text: "Data da Despesa", value: "Data" },
        { text: "Valor", value: "Valor" },
        { text: "Valor no Período", value: "valorPeriodo" },
      ],
      produtos: [],
      total: 0,
      periodSelected: "",
      produtosEdicao: [],
      editou: false,
      deletou: false,
      currentDate: "",
    };
  },

  computed: {
    valuePeriod() {
      let valorPeriod = 0;
      for (var prop in this.produtos) {
        if (this.produtos[prop].tipo === "Fixo") {
          if (this.periodSelected === "Mensal") {
            valorPeriod += this.produtos[prop].valor;
          }
          if (this.periodSelected === "Semanal") {
            valorPeriod += this.produtos[prop].valor * 4;
          }
          if (this.periodSelected === "Anual") {
            valorPeriod += this.produtos[prop].valor * 12;
          }
        }
        if (this.produtos[prop].tipo === "Variavel") {
          valorPeriod += this.produtos[prop].valor;
        }
      }
      return valorPeriod;
    },
  },

  methods: {
    async searchDespesa() {
      const variables = {
        periodSelected: this.periodSelected,
        currentDate: this.currentDate,
      };
      this.produtos = await despesasService.despesas(variables);
      console.log(this.produtos);
    },
    date(pValue) {
      this.currentDate = pValue;
      this.searchDespesa();
    },
    period(value) {
      this.periodSelected = value;
    },
    close(item) {
      this.editou = item;
    },
    formatDateTable(value) {
      console.log(value);
      return moment(value.substr(0, 10)).format("DD/MM/YYYY");
    },

    edicaoItens(item) {
      this.editou = item;
    },
    deletouItens(item) {
      this.deletou = item;
      console.log(this.deletou);
    },
    calculaValorPeriodo(item) {
      return item.TipoDespesa.DescrTipoDespesa === "Fixo"
        ? this.periodSelected === "Mensal"
          ? item.Valor
          : this.periodSelected === "Semanal"
          ? item.Valor * 4
          : this.periodSelected === "Anual"
          ? item.Valor * 12
          : 0
        : item.Valor;
    },
    calculaTotalMêsFixo() {
      return this.produtos.reduce((a, b) => {
        return b.tipo === "Fixo"
          ? this.search === "variavel"
            ? 0
            : a + b.valor
          : a;
      }, 0);
    },
    calculaTotalMêsVariavel() {
      return this.produtos.reduce((a, b) => {
        return b.tipo === "Variavel"
          ? this.search === "fixo"
            ? 0
            : a + b.valor
          : a;
      }, 0);
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
