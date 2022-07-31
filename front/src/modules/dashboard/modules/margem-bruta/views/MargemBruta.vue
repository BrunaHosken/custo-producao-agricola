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
      <v-card elevation="24" outlined>
        <v-card-title v-if="cards.length === 0">
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhuma Margem Bruta criada. <br />
          Crie um Cultura Desenvolvida e depois uma Venda para poder visualizar
          este conteúdo!</v-card-title
        >
        <v-container v-else fluid grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="card in cards" :key="card.index" pa-4 xs6>
              <v-card elevation="24" outlined class="hover-card">
                <v-card-title class="headline justify-center">
                  Cultura: {{ card.cultura }}
                </v-card-title>
                <v-card-subtitle class="headline text-center">
                  Data Criação: {{ card.day }}</v-card-subtitle
                >
                <hr />
                <v-card-text class="text-center">
                  <p>
                    Total vendido: {{ card.vendido.toLocaleString() }}
                    {{ card.unidade }}
                  </p>
                  <p>Valor vendido: {{ formatCurrency(card.valorVenda) }}</p>
                  <p>
                    Custo unitário:
                    {{ formatCurrency(card.custo || 0) }}
                  </p>
                  <p>
                    Receita Bruta:
                    {{ formatCurrency(receitaBruta(card)) }}
                  </p>

                  <p>
                    Custo da produção:
                    {{ formatCurrency(custoProducao(card)) }}
                  </p>
                  <p v-if="periodoAtual === 'Semanal'">
                    Margem bruta semanal:
                    {{ formatCurrency(margemBrutaSemanal(card)) }}
                  </p>
                  <p v-if="periodoAtual === 'Mensal'">
                    Margem bruta mensal:
                    {{ formatCurrency(margemBrutaMensal(card)) }}
                  </p>
                  <p v-if="periodoAtual === 'Anual'">
                    Margem bruta anual:
                    {{ formatCurrency(margemBrutaAnual(card)) }}
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import margemBrutaService from "./../services/margemBruta-service";
import "core-js/actual/array/group-by-to-map";

export default {
  name: "MargemBruta",
  mixins: [formatCurrentMixin],
  components: {
    ToolbarByMonth,
  },
  data() {
    return {
      periodoAtual: "",
      currentDate: "",
      cards: [],
      response: [],
    };
  },
  methods: {
    groupBy(item) {
      const produtos = [];

      item.forEach((p) => {
        produtos.push({
          index: p.CulturaDesenvolvida.id,
          day: moment(p.Venda.Data.substr(0, 10)).format("DD/MM/YYYY"),
          cultura: p.CulturaDesenvolvida.Cultura.DescrCultura,
          vendido: p.Qtd,
          unidade: p.CulturaDesenvolvida.Cultura.Und,
          valorVenda: p.total,
          custo: 0,
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

          this.cards.push({
            index: product[0].index,
            day: product[0].day,
            cultura: product[0].cultura,
            vendido,
            unidade: product[0].unidade,
            valorVenda,
            custo: product[0].custo,
          });
        } else {
          this.cards.push({
            index: product[0].index,
            day: product[0].day,
            cultura: product[0].cultura,
            vendido: product[0].vendido,
            unidade: product[0].unidade,
            valorVenda: product[0].valorVenda,
            custo: product[0].custo,
          });
        }
      });
    },

    async searchMargemBruta() {
      this.cards = [];
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      const response = await margemBrutaService.culturaDesenvolvidaWithVendas(
        variables
      );
      this.response = response;

      this.groupBy(response);
    },
    date(pValue) {
      this.currentDate = pValue;
      this.searchMargemBruta();
    },
    period(pValue) {
      this.periodoAtual = pValue;
    },
    receitaBruta(card) {
      return card.vendido * card.valorVenda;
    },
    custoProducao(card) {
      let total = 0;
      this.response.forEach((item) => {
        if (card.index === item.CulturaDesenvolvida.id) {
          total += item.custoUnitario;
        }
      });
      card.custo = total;
      return card.vendido * card.custo;
    },
    margemBrutaSemanal(card) {
      return this.receitaBruta(card) - this.custoProducao(card);
    },
    margemBrutaMensal(card) {
      return this.margemBrutaSemanal(card) * 4;
    },
    margemBrutaAnual(card) {
      return this.margemBrutaMensal(card) * 12;
    },
  },
};
</script>

<style lang="scss">
.hover-card:hover {
  background: linear-gradient(rgba(85, 85, 85, 0.7), rgba(85, 85, 85, 0.7));
}
.hover-card {
  filter: brightness(1.5);
}
</style>
