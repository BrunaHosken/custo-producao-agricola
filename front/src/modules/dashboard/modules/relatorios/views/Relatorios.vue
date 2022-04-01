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
        <ToolbarByMonth class="mt-5 mb-3" format="MM-YYYY" month="02" />
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
            item-key="text"
            loading-text="Loading... Please wait"
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
            <template v-slot:[`item.despesas`]="{ item }">
              {{ formatCurrency(item.despesas) }}
            </template>

            <template v-slot:[`item.total`]="{ item }">
              <v-chip :color="getColor(item)" dark>
                {{ formatCurrency(produtos.total) }}
              </v-chip>
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
export default {
  name: "Relatorios",
  mixins: [formatCurrentMixin],
  components: { ToolbarByMonth },
  data: () => ({
    charts: [
      { title: "Tipo de Consumo Fixo", refId: "chartFixesIncomes" },
      { title: "Tipo de Consumo Variável", refId: "chartVariablesIncomes" },
      { title: "Vendas por Cliente", refId: "chartClientsSales" },
      { title: "Lucro por Cultura", refId: "chartIncomesCultures" },
    ],
    search: "",
    headers: [
      {
        text: "Produto",
        value: "name",
        align: "center",
        sortable: false,
      },
      {
        text: "Lucro",
        align: "center",
        sortable: false,
        value: "lucro",
      },
      {
        text: "Cultura Desenvolvida",
        align: "center",
        sortable: false,
        value: "custoProducao",
      },
      {
        text: "Valor Venda",
        align: "center",
        sortable: false,
        value: "venda",
      },
      {
        text: "Lucro Maço",
        align: "center",
        sortable: false,
        value: "lucroMaco",
      },
      {
        text: "Despesas Totais",
        align: "center",
        sortable: false,
        value: "despesas",
      },
      {
        text: "Total Mês",
        align: "center",
        sortable: false,
        value: "total",
      },
    ],
    produtos: [
      {
        name: "Crisântemo",
        lucro: 246960,
        custoProducao: 2.59,
        venda: 7,
        lucroMaco: 88.2,
        despesas: 2700,
        total: 0,
      },
    ],
  }),
  computed: {},
  mounted() {
    this.setChartsBar();
    this.setChartsDoughnut();
    this.setChartsDoughnut1();
    this.setChartsDoughnut2();
  },
  destroyed() {},
  methods: {
    qtdEstoque(data) {
      const estoque = data.lucro - data.despesas;
      this.produtos.total = estoque;
      return estoque;
    },
    getColor(data) {
      const total = this.qtdEstoque(data);
      if (total === 0) return "error";
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
    setChartsDoughnut() {
      const ctx = this.$refs.chartVariablesIncomes[0].getContext("2d");
      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [],
              hoverOffset: 4,
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
    setChartsDoughnut1() {
      const ctx = this.$refs.chartFixesIncomes[0].getContext("2d");
      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Mão de Obra", "Taxa e Impostos", "Manutenção Familiar"],
          datasets: [
            {
              data: [1400, 400, 900],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
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
    setChartsDoughnut2() {
      const ctx = this.$refs.chartClientsSales[0].getContext("2d");
      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Feira", "Floricultura do Seu João"],
          datasets: [
            {
              data: [23000, 26750],
              backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
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
