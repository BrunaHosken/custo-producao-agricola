<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth
        class="mt-5 mb-3"
        format="MM-YYYY"
        month="02"
        @period="period"
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
          Despesas do Mês {{ valuePeriod }}
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
        >
          <template v-slot:[`item.data`]="{ item }">
            {{ formatDateTable(item.data) }}
          </template>
          <template v-slot:[`item.valor`]="{ item }">
            {{ formatCurrency(item.valor) }}
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
import { required, minLength, minValue } from "vuelidate/lib/validators";
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

          value: "name",
        },
        { text: "Tipo", value: "tipo" },
        { text: "Data da Despesa", value: "data" },
        { text: "Valor", value: "valor" },
        { text: "Valor no Período", value: "valorPeriodo" },
      ],
      produtos: [
        {
          index: 1,
          name: "Manutenção Familiar",
          tipo: "Fixo",
          data: moment().format("YYYY-MM-DD"),
          valor: 1400,
          valorPeriodo: 0,
        },
        {
          index: 2,
          name: "Taxa e impostos",
          tipo: "Fixo",
          data: moment().format("YYYY-MM-DD"),
          valor: 400,
          valorPeriodo: 0,
        },
        {
          index: 3,
          name: "Mão de Obra",
          tipo: "Fixo",
          data: moment().format("YYYY-MM-DD"),
          valor: 900,
          valorPeriodo: 0,
        },
        {
          index: 4,
          name: "Mão de Obra v",
          tipo: "Variavel",
          data: moment().format("YYYY-MM-DD"),
          valor: 900,
          valorPeriodo: 0,
        },
      ],
      total: 0,
      periodSelected: "",
      produtosEdicao: [],
      editou: false,
      deletou: false,
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
    period(value) {
      this.periodSelected = value;
    },
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
    calculaValorPeriodo(item) {
      return item.tipo === "Fixo"
        ? this.periodSelected === "Mensal"
          ? item.valor
          : this.periodSelected === "Semanal"
          ? item.valor * 4
          : this.periodSelected === "Anual"
          ? item.valor * 12
          : 0
        : item.valor;
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
