<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          Insumos
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
          <template v-slot:[`item.preco`]="{ item }">
            {{ formatCurrency(item.preco) }}
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
                      :error-messages="descriptionErrors"
                      :success="!$v.formEditou.descricao.$invalid"
                      v-model.trim="$v.formEditou.descricao.$model"
                      label="Descrição do Insumo"
                      prepend-inner-icon="mdi-book-variant"
                      required
                    ></v-text-field>
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
                    <v-select
                      v-model="formEditou.unidade"
                      :items="unidades"
                      label="Unidade do Insumo"
                      prepend-inner-icon="mdi-format-list-numbered"
                      outlined
                    ></v-select>
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
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";

export default {
  name: "Insumos",
  components: {
    AppFloatingButton,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      formEditou: {
        index: 0,
        descricao: "",
        valor: 0,
        tipo: "Sementes ou Mudas",
        unidade: "Milheiro",
      },

      search: "",
      selected: [],
      headers: [
        {
          text: "Insumo",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Tipo", value: "tipo" },
        { text: "Unidade", value: "unidade" },

        { text: "Preço Unitário", value: "preco" },
      ],
      produtos: [
        {
          index: 1,
          name: "Mudas",
          tipo: "Sementes ou Mudas",
          unidade: "Milheiro",
          preco: 35,
        },
        {
          index: 2,
          name: "Calcário",
          tipo: "Adubos ou Corretivos",
          unidade: "Toneladas",
          preco: 100,
        },
        {
          index: 3,
          name: "Fungicidas",
          tipo: "Defensivos",
          unidade: "Quilograma/Litro",
          preco: 45,
        },
        {
          index: 4,
          name: "Frete",
          tipo: "Materiais",
          unidade: "maço",
          preco: 0.5,
        },
      ],
      total: 0,
      totalAnual: 0,
      produtosEdicao: [],
      editou: false,
      deletou: false,
      items: [
        "Sementes ou Mudas",
        "Adubos ou Corretivos",
        "Defensivos",
        "Materiais",
      ],
      unidades: [
        "Milheiro",
        "Toneladas",
        "Quilograma/Litro",
        "Maço",
        "Unitário",
        "Litros",
        "Quilowatt",
      ],
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
    edicaoItens(item) {
      this.editou = item;
      console.log(this.formEditou);
      console.log(this.selected);
      this.formEditou = {
        index: this.selected[0].index,
        descricao: this.selected[0].name,
        valor: this.selected[0].preco,
        tipo: this.selected[0].tipo,
        unidade: this.selected[0].unidade,
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
