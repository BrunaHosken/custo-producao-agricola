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
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
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
          unidade: "Maço",
          preco: 0.5,
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
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.valor;
      }, 0);
    },
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
