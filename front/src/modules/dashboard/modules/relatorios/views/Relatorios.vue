<template>
  <v-layout>
    <v-layout v-show="produtos.length === 0" row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <v-icon size="50" color="warning" class="mr-2"
              >mdi-alert-circle</v-icon
            >
            Nenhum Relatório criado. <br />
            Certifique-se de terem sido criados pelo menos um Cultura
            Desenvolvida, uma Venda e uma Despesa!</v-card-title
          >
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-show="produtos.length > 0" row wrap>
      <v-flex xs12>
        <ToolbarByMonth
          class="mt-5 mb-3"
          format="MM-YYYY"
          month=""
          @period="period"
          @date="date"
        />
      </v-flex>
      <v-flex v-for="chart in charts" :key="chart.title" xs12 sm6 md6 lg6 xl6>
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
            <template v-slot:[`item.lucro`]="{ item }">
              {{ formatCurrency(item.lucro) }}
            </template>
            <template v-slot:[`item.custoProducao`]="{ item }">
              {{ formatCurrency(item.custoProducao) }}
            </template>
            <template v-slot:[`item.venda`]="{ item }">
              {{ formatCurrency(item.venda) }}
            </template>
            <template v-slot:[`item.lucroMaco`]="{ item }">
              {{ formatCurrency(item.lucroMaco) }}
            </template>
            <template v-slot:[`body.append`]>
              <tr>
                <td class="font-weight-black">
                  Despesas: {{ formatCurrency(despesas) }}
                </td>
                <td colspan="3"></td>
                <td colspan="4">
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
import { generateChartConfigs } from "./../../../../../utils";
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
      { title: "Lucro por Cultura", refId: "chartIncomesCultures" },
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
        text: "Lucro",
        value: "lucro",
      },
      {
        text: "Cultura Desenvolvida",
        value: "custoProducao",
      },
      {
        text: "Valor Venda",
        value: "venda",
      },
      {
        text: "Lucro Maço",
        value: "lucroMaco",
      },
    ],
    produtos: [
      {
        id: 0,
        name: "Crisântemo",
        lucro: 246960,
        custoProducao: 2.59,
        venda: 7,
        lucroMaco: 88.2,
      },
      {
        id: 1,
        name: "Crisântemo",
        lucro: 246960,
        custoProducao: 2.59,
        venda: 7,
        lucroMaco: 88.2,
      },
    ],
    despesas: 10000,
    total: 0,
  }),
  computed: {},
  mounted() {
    this.setChartsBar();
  },
  destroyed() {},
  methods: {
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
      this.currentDate = pValue;
      await this.searchDespesa();
      await this.searchSales();
      this.setCharts();
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
    setChartsBar() {
      const ctx = this.$refs.chartIncomesCultures[0].getContext("2d");
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          datasets: [
            {
              data: [246960],
              label: "Crisântemo",
              backgroundColor: [this.$vuetify.theme.themes.dark.error],
            },
            {
              data: [240000],
              label: "Rosa",
              backgroundColor: [this.$vuetify.theme.themes.dark.info],
            },
            {
              data: [270900],
              label: "Gérbera",
              backgroundColor: [this.$vuetify.theme.themes.dark.success],
            },
            {
              data: [300000],
              label: "Copo de Leite",
              backgroundColor: [this.$vuetify.theme.themes.dark.accent],
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    },
  },
};
</script>
