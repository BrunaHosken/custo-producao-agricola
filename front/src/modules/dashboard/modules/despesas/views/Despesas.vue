<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth class="mt-5 mb-3" format="MM-YYYY" month="02" />
      <TotalBalance class="mt-5 mb-3" :value="value" />
    </v-flex>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          Despesas do Mês
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
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
          <template v-slot:[`item.valor`]="{ item }">
            {{ formatCurrency(item.valor) }}
          </template>
          <template v-slot:[`item.valorAnual`]="{ item }">
            {{ formatCurrency(calculaValorAnual(item)) }}
          </template>
          <template v-slot:[`body.append`]>
            <tr>
              <td colspan="12">
                <h3 class="mt-2">
                  Total do Mês (Despesas Fixas):
                  {{ formatCurrency(calculaTotalMêsFixo(produtos)) }}
                </h3>

                <h3>
                  Total do Mês (Despesas Variaveis):
                  {{ formatCurrency(calculaTotalMêsVariavel(produtos)) }}
                </h3>

                <h3 class="mb-2">
                  Total do Ano:
                  {{ formatCurrency(calculaTotalAnual(produtos)) }}
                </h3>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <v-dialog v-model="editou" persistent max-width="600px">
      <v-flex xs12>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Editar Despesa
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-btn icon dark @click="editou = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-container>
                <v-row class="mt-2">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formEditou.date"
                      name="date"
                      label="Data da Despesa"
                      prepend-inner-icon="mdi-calendar"
                      type="text"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formEditou.tipo"
                      label="Tipo de Despesa"
                      outlined
                      :items="items"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row class="mt-0">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formEditou.descricao"
                      label="Descrição da Despesa"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formEditou.valor"
                      label="Valor da Despesa"
                      value="0"
                      prefix="R$"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="mb-4">
            <v-spacer></v-spacer>
            <v-btn color="secundary" class="mr-4" @click="cancelar">
              Cancelar
            </v-btn>
            <v-btn color="success" class="mr-4" @click="salvar"> Salvar </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>

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

import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import TotalBalance from "./../../components/TotalBalance.vue";

export default {
  name: "Despesas",
  components: {
    ToolbarByMonth,

    AppFloatingButton,
    TotalBalance,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      formEditou: {
        date: "",
        descricao: "",
        valor: 0,
        tipo: "",
      },

      search: "",
      selected: [],
      headers: [
        {
          text: "Despesa",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Tipo", value: "tipo" },
        { text: "Data da Despesa", value: "data" },
        { text: "Valor", value: "valor" },
        { text: "Valor Anual", value: "valorAnual" },
      ],
      produtos: [
        {
          index: 1,
          name: "Manutenção Familiar",
          tipo: "Fixo",
          data: moment().format("DD/MM/YYYY"),
          valor: 1400,
          valorAnual: 0,
        },
        {
          index: 2,
          name: "Taxa e impostos",
          tipo: "Fixo",
          data: moment().format("DD/MM/YYYY"),
          valor: 400,
          valorAnual: 0,
        },
        {
          index: 3,
          name: "Mão de Obra",
          tipo: "Fixo",
          data: moment().format("DD/MM/YYYY"),
          valor: 900,
          valorAnual: 0,
        },
        {
          index: 4,
          name: "Mão de Obra v",
          tipo: "Variavel",
          data: moment().format("DD/MM/YYYY"),
          valor: 900,
          valorAnual: 0,
        },
      ],
      total: 0,
      totalAnual: 0,
      produtosEdicao: [],
      editou: false,
      deletou: false,
      items: ["Fixo", "Variavel"],
    };
  },
  computed: {
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.valor;
      }, 0);
    },
  },

  methods: {
    edicaoItens(item) {
      this.editou = item;
      this.formEditou = {
        index: this.selected[0].index,
        date: this.selected[0].data,
        descricao: this.selected[0].name,
        valor: this.selected[0].valor,
        tipo: this.selected[0].tipo,
      };
    },
    deletouItens(item) {
      this.deletou = item;
      console.log(this.deletou);
    },
    calculaValorAnual(item) {
      return item.tipo === "Fixo" ? item.valor * 12 : 0;
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
    cancelar() {
      this.editou = false;
    },
    salvar() {
      this.editou = false;
      console.log(this.formEditou);
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
