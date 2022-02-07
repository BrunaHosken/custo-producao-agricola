<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth class="mt-5 mb-3" format="MM-YYYY" month="02" />
    </v-flex>
    <v-flex xs12>
      <v-card elevation="24" outlined>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex
              v-for="card in cards"
              :key="card.index"
              v-bind="{ [`xs${card.flex}`]: true }"
              pa-4
            >
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
                  <p>Custo unitário: {{ formatCurrency(card.custo) }}</p>
                  <p>
                    Receita Bruta:
                    {{ formatCurrency(receitaBruta(card.item, card.index)) }}
                  </p>
                  <p>
                    Custo produção:
                    {{ formatCurrency(custoProducao(card.item, card.index)) }}
                  </p>
                  <p>
                    Margem bruta semanal:
                    {{
                      formatCurrency(margemBrutaSemanal(card.item, card.index))
                    }}
                  </p>
                  <p>
                    Margem bruta mensal:
                    {{
                      formatCurrency(margemBrutaMensal(card.item, card.index))
                    }}
                  </p>
                  <p>
                    Margem bruta anual:
                    {{
                      formatCurrency(margemBrutaAnual(card.item, card.index))
                    }}
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
// import moment from "moment";

import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";

import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
export default {
  name: "MargemBruta",
  mixins: [formatCurrentMixin],
  components: {
    ToolbarByMonth,
  },
  data() {
    return {
      cards: [
        {
          index: 0,
          day: moment().format("DD/MM/YYYY"),
          cultura: "Crisântemo",
          vendido: 14000,
          unidade: "maços",
          flex: 6,
          valorVenda: 7,
          custo: 2.59,
        },
      ],
    };
  },
  methods: {
    receitaBruta(card, index) {
      console.log(this.cards[index]);
      return this.cards[index].vendido * this.cards[index].valorVenda;
    },
    custoProducao(card, index) {
      return this.cards[index].vendido * this.cards[index].custo;
    },
    margemBrutaSemanal(card, index) {
      return this.receitaBruta(card, index) - this.custoProducao(card, index);
    },
    margemBrutaMensal(card, index) {
      return this.margemBrutaSemanal(card, index) * 4;
    },
    margemBrutaAnual(card, index) {
      return this.margemBrutaMensal(card, index) * 12;
    },
  },
};
</script>

<style lang="scss">
.hover-card:hover {
  background: #616161;
}
</style>
