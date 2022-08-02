<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <ToolbarByMonth
          class="mt-5 mb-3"
          format="MM-YYYY"
          month=""
          @period="period"
          @date="date"
        />
      </v-flex>
      <v-flex v-for="chart in charts" :key="chart.title" xs12 sm4 md4 lg4 xl4>
        <v-card elevation="24" outlined>
          <v-card-text>
            <h2 class="font-weight-light mb-4">{{ chart.title }}</h2>
            <canvas :ref="chart.refId"></canvas>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card elevation="24" outlined>
          <v-card-title>
            Margem Bruta e Despesas
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
            item-key="id"
            loading-text="Loading... Please wait"
            multi-sort
          >
            <template v-slot:[`item.custo`]="{ item }">
              {{ formatCurrency(custoProducao(item)) }}
            </template>
            <template v-slot:[`item.valorVenda`]="{ item }">
              {{ formatCurrency(item.precoUnit) }}
            </template>
            <template v-slot:[`item.lucroMaco`]="{ item }">
              {{ formatCurrency(lucroTotal(item)) }}
            </template>
            <template v-slot:[`item.lucro`]="{ item }">
              {{ formatCurrency(margemBruta(item)) }}
            </template>
            <template v-slot:[`body.append`]>
              <tr>
                <td class="font-weight-black">
                  Despesas: {{ formatCurrency(despesas) }}
                </td>
                <td colspan="2"></td>
                <td colspan="3">
                  Total do período:
                  <v-chip :color="getColor(total)" dark>
                    {{ formatCurrency(total) }}
                  </v-chip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import Chart from "chart.js";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import despesasService from "./../../despesas/services/despesa-service";
import vendasService from "./../../vendas/services/vendasService";
import margemBrutaService from "./../../margem-bruta/services/margemBruta-service";
import { generateChartConfigs } from "./../../../../../utils";
import "core-js/actual/array/group-by-to-map";

export default {
  name: "Relatorios",
  mixins: [formatCurrentMixin],
  components: { ToolbarByMonth },
  data: () => ({
    chartFixesIncomes: undefined,
    chartVariablesIncomes: undefined,
    chartClientsSales: undefined,
    charts: [
      { title: "Tipo de Consumo Fixo", refId: "chartFixesIncomes" },
      { title: "Tipo de Consumo Variável", refId: "chartVariablesIncomes" },
      { title: "Vendas por Cliente", refId: "chartClientsSales" },
    ],
    despesaChart: [],
    salesChart: [],
    search: "",
    periodoAtual: "",
    currentDate: "",
    headers: [
      {
        text: "Produto",
        value: "name",
      },
      {
        text: "Cultura Desenvolvida",
        value: "custo",
      },
      {
        text: "Valor Venda",
        value: "valorVenda",
      },
      {
        text: "Lucro Maço",
        value: "lucroMaco",
      },
      {
        text: "Lucro",
        value: "lucro",
      },
    ],
    produtos: [],
    despesas: 0,
    total: 0,
  }),
  computed: {},
  mounted() {},
  destroyed() {},
  methods: {
    receitaBruta(card) {
      return card.vendido * card.precoUnit;
    },
    custoProducao(card) {
      let total = 0;
      this.response.forEach((item) => {
        if (card.index === item.CulturaDesenvolvida.id) {
          total += item.custoUnitario;
        }
      });
      card.custo = total;
      return total;
    },
    lucroTotal(card) {
      const lucro = card.precoUnit - card.custo;
      card.lucroMaco = lucro;
      return lucro;
    },
    margemBruta(card) {
      let total = 0;
      if (this.periodoAtual === "Mensal")
        total =
          this.receitaBruta(card) - this.custoProducao(card) * card.vendido;
      if (this.periodoAtual === "Semanal")
        total =
          (this.receitaBruta(card) - this.custoProducao(card) * card.vendido) *
          4;
      if (this.periodoAtual === "Anual")
        total =
          (this.receitaBruta(card) - this.custoProducao(card) * card.vendido) *
          12;
      card.lucro = total;
      return total;
    },

    async searchDespesa() {
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      this.despesaChart = await despesasService.despesas(variables);
    },
    async searchSales() {
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      this.salesChart = await vendasService.vendas(variables);
    },
    period(pValue) {
      this.periodoAtual = pValue;
    },
    async date(pValue) {
      this.despesas = 0;
      (this.total = 0), (this.currentDate = pValue);
      await this.searchDespesa();
      await this.searchSales();
      this.salesDespesas();
      this.searchMargemBruta();
      this.setCharts();
    },
    async searchMargemBruta() {
      this.produtos = [];
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      this.response = await margemBrutaService.culturaDesenvolvidaWithVendas(
        variables
      );
      this.groupBy(this.response);
    },

    groupBy(item) {
      const produtos = [];
      item.forEach((p) => {
        produtos.push({
          index: p.CulturaDesenvolvida.id,
          cultura: p.CulturaDesenvolvida.Cultura.DescrCultura,
          custo: 0,
          valorVenda: p.total,
          precoUnit: p.PrecoUnit,
          vendido: p.Qtd,
          lucro: 0,
          lucroMaco: 0,
        });
      });
      const groupByCategory = produtos.groupByToMap((product) => {
        return product.index;
      });

      const array = [];
      groupByCategory.forEach((product) => {
        if (product.length > 1) {
          const valorVenda = (array.valorVenda = product.reduce((a, b) => {
            return a + b.valorVenda;
          }, 0));
          const vendido = product.reduce((a, b) => {
            return a + b.vendido;
          }, 0);

          this.produtos.push({
            index: product[0].index,
            name: product[0].cultura,
            custo: Number(product[0].custo),
            valorVenda,
            vendido,
            precoUnit: product[0].precoUnit,
            lucro: Number(product[0].lucro),
            lucroMaco: Number(product[0].lucroMaco),
          });
        } else {
          this.produtos.push({
            index: product[0].index,
            name: product[0].cultura,
            precoUnit: product[0].precoUnit,
            custo: Number(product[0].custo),
            valorVenda: Number(product[0].valorVenda),
            vendido: Number(product[0].vendido),
            lucro: Number(product[0].lucro),
            lucroMaco: Number(product[0].lucroMaco),
          });
        }
      });
    },

    salesDespesas() {
      this.despesaChart.forEach((item) => {
        if (item.TipoDespesa.DescrTipoDespesa === "Fixo") {
          if (this.periodoAtual === "Mensal")
            this.despesas += Number(item.Valor);
          if (this.periodoAtual === "Semanal")
            this.despesas += Number(item.Valor) * 4;
          if (this.periodoAtual === "Anual")
            this.despesas += Number(item.Valor) * 12;
        } else {
          this.despesas += Number(item.Valor);
        }
      });
    },
    updateOrCreateChart(chartId, options) {
      if (this[chartId]) {
        this[chartId].data.datasets = options.data.datasets;
        if (options.data.labels) {
          this[chartId].data.labels = options.data.labels;
        }
        this[chartId].update();
        return this[chartId];
      }

      const ref = Array.isArray(this.$refs[chartId])
        ? this.$refs[chartId][0]
        : this.$refs[chartId];

      const ctx = ref.getContext("2d");
      this[chartId] = new Chart(ctx, options);
      return this[chartId];
    },

    setCharts() {
      this.updateOrCreateChart(
        "chartFixesIncomes",
        generateChartConfigs({
          type: "doughnut",
          items: this.despesaChart.filter(
            (d) => d.TipoDespesa.DescrTipoDespesa === "Fixo"
          ),
          keyToGroup: "DescrDetalhada",
          keyOfValue: "Valor",
        })
      );
      this.updateOrCreateChart(
        "chartVariablesIncomes",
        generateChartConfigs({
          type: "doughnut",
          items: this.despesaChart.filter(
            (d) => d.TipoDespesa.DescrTipoDespesa === "Variável"
          ),
          keyToGroup: "DescrDetalhada",
          keyOfValue: "Valor",
        })
      );
      this.updateOrCreateChart(
        "chartClientsSales",
        generateChartConfigs({
          type: "doughnut",
          items: this.salesChart,
          keyToGroup: "CulturaDesenvolvida.Cultura.DescrCultura",
          keyOfValue: "total",
        })
      );
    },

    calculaTotalLucro(data) {
      let lucros = 0;
      for (var prop in this.produtos) {
        lucros += this.produtos[prop].lucro;
      }
      this.total = lucros - this.despesas;
      return this.total;
    },
    getColor(data) {
      const total = this.calculaTotalLucro(data);

      if (total <= 0) return "error";
      else return "success";
    },
  },
};
</script>
