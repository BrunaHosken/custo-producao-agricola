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
          multi-sort
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
import "core-js/actual/array/group-by-to-map";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import vendasService from "./../../vendas/services/vendasService";
export default {
  name: "ControleEstoque",
  mixins: [formatCurrentMixin],
  components: {
    ToolbarByMonth,
  },
  data() {
    return {
      search: "",
      periodoAtual: "",
      currentDate: "",
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
      produtos: [],
    };
  },
  computed: {},
  methods: {
    groupBy(item) {
      const produtos = [];
      item.forEach((p) => {
        produtos.push({
          name: p.CulturaDesenvolvida.Cultura.DescrCultura,
          colhida: p.CulturaDesenvolvida.QtdColhida,
          vendida: p.Qtd,
        });
      });

      const groupByCategory = produtos.groupByToMap((product) => {
        return product.name;
      });
      const array = [];
      groupByCategory.forEach((product) => {
        if (product.length > 1) {
          const colhida = (array.colhida = product.reduce((a, b) => {
            return a + b.colhida;
          }, 0));
          const vendida = product.reduce((a, b) => {
            return a + b.vendida;
          }, 0);
          this.produtos.push({ name: product[0].name, colhida, vendida });
        } else {
          this.produtos.push({
            name: product[0].name,
            colhida: product[0].colhida,
            vendida: product[0].vendida,
          });
        }
      });
    },
    async searchSales() {
      this.produtos = [];
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      const response = await vendasService.vendas(variables);
      this.groupBy(response);
    },
    period(pValue) {
      this.periodoAtual = pValue;
    },

    async date(pValue) {
      this.currentDate = pValue;
      this.searchSales();
    },
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
