<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth class="mt-5 mb-3" format="MM-YYYY" month="02" />
      <TotalBalance class="mt-5 mb-3" :value="value" />
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
        >
          <template v-slot:[`item.data`]="{ item }">
            {{ formatDateTable(item.data) }}
          </template>
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
                    <v-dialog
                      ref="dateDialog"
                      :return-value.sync="formEditou.date"
                      v-model="showDateDialog"
                      persistent
                      lazy
                      width="290px"
                      fullwidth
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          name="date"
                          label="Data da Venda"
                          prepend-inner-icon="mdi-calendar"
                          type="text"
                          readonly
                          :value="formattedDate"
                          v-on="on"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValue"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="cancelDateDialog"> Cancelar </v-btn>
                        <v-btn
                          text
                          @click="$refs.dateDialog.save(dateDialogValue)"
                        >
                          Ok
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formEditou.tipo"
                      label="Tipo de Despesa"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                      :items="items"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row class="mt-0">
                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="descriptionErrors"
                      :success="!$v.formEditou.descricao.$invalid"
                      v-model.trim="$v.formEditou.descricao.$model"
                      label="Descrição da Despesa"
                      prepend-inner-icon="mdi-book-variant"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="valueErrors"
                      :success="!$v.formEditou.valor.$invalid"
                      v-model.trim="$v.formEditou.valor.$model"
                      label="Valor da Despesa"
                      prepend-inner-icon="mdi-cash-multiple"
                      :value="formEditou.valor"
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
            <v-btn
              color="success"
              class="mr-4"
              :disabled="$v.$invalid"
              @click="salvar"
            >
              Salvar
            </v-btn>
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

import { required, minLength, minValue } from "vuelidate/lib/validators";
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
        date: moment().format("DD-MM-YYYY"),
        descricao: "",
        valor: 0,
        tipo: "",
      },
      showDateDialog: false,
      dateDialogValue: moment().format("DD-MM-YYYY"),
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
          data: moment().format("YYYY-MM-DD"),
          valor: 1400,
          valorAnual: 0,
        },
        {
          index: 2,
          name: "Taxa e impostos",
          tipo: "Fixo",
          data: moment().format("YYYY-MM-DD"),
          valor: 400,
          valorAnual: 0,
        },
        {
          index: 3,
          name: "Mão de Obra",
          tipo: "Fixo",
          data: moment().format("YYYY-MM-DD"),
          valor: 900,
          valorAnual: 0,
        },
        {
          index: 4,
          name: "Mão de Obra v",
          tipo: "Variavel",
          data: moment().format("YYYY-MM-DD"),
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
  validations() {
    return {
      formEditou: {
        descricao: {
          required,
          minLength: minLength(2),
        },
        valor: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  computed: {
    formattedDate() {
      return moment(this.formEditou.date).format("DD/MM/YYYY");
    },
    descriptionErrors() {
      const errors = [];
      const description = this.$v.formEditou.descricao;
      if (!description.$dirty) {
        return errors;
      }
      !description.required && errors.push("Descrição é obrigatória!");
      !description.minLength &&
        errors.push(
          `Insira pelo menos ${description.$params.minLength.min} caracteres!`
        );
      return errors;
    },
    valueErrors() {
      const errors = [];
      const value = this.$v.formEditou.valor;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Valor da despesa é obrigatória!");
      !value.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.valor;
      }, 0);
    },
  },

  methods: {
    formatDateTable(value) {
      return moment(value).format("DD/MM/YYYY");
    },
    cancelDateDialog() {
      this.showDateDialog = false;
      this.dateDialogValue = this.formEditou.date;
    },
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
