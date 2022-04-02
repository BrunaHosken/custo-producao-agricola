<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth class="mt-5 mb-3" format="MM-YYYY" month="02" />
    </v-flex>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhum Controle de Estoque criado. <br />
          Crie uma Cultura Desenvolvida e depois uma Venda para poder visualizar
          este conteúdo!</v-card-title
        >
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Controle de Estoque do Produto Terminado
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="produtos"
          :search="search"
          :loading="false"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.colhida`]="{ item }">
            {{ item.colhida.toLocaleString() }}
          </template>
          <template v-slot:[`item.vendida`]="{ item }">
            {{ item.vendida.toLocaleString() }}
          </template>
          <template v-slot:[`item.estoque`]="{ item }">
            <v-chip :color="getColor(item)" dark>
              {{ produtos.estoque }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import moment from "moment";

import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
export default {
  name: "ControleEstoque",
  mixins: [formatCurrentMixin],
  components: {
    ToolbarByMonth,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Produto",
          value: "name",
          align: "center",
        },
        {
          text: "Quantidade Colhida",
          align: "center",

          value: "colhida",
        },
        {
          text: "Quantidade Vendida",
          align: "center",

          value: "vendida",
        },
        {
          text: "Quantidade Estoque",
          align: "center",

          value: "estoque",
        },
      ],
      produtos: [
        {
          name: "Crisântemo",
          colhida: 14000,
          vendida: 14000,
          estoque: 0,
        },
        {
          name: "Gérbera",
          colhida: 10000,
          vendida: 9000,
          estoque: 0,
        },
        {
          name: "Limonium",
          colhida: 15000,
          vendida: 14500,
          estoque: 0,
        },
        {
          name: "Rosa",
          colhida: 13000,
          vendida: 12250,
          estoque: 0,
        },
      ],
    };
  },
  computed: {},
  methods: {
    qtdEstoque(data) {
      const estoque = data.colhida - data.vendida;
      this.produtos.estoque = estoque;
      return estoque;
    },
    getColor(data) {
      const estoque = this.qtdEstoque(data);
      if (estoque === 0) return "error";
      else if (estoque <= 500) return "orange";
      else return "success";
    },
  },
};
</script>
