<template>
  <v-card elevation="24" outlined>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex
          v-for="card in cards"
          :key="card.index"
          v-bind="{ [`xs${card.flex}`]: true }"
          pa-4
        >
          <v-card elevation="24" outlined>
            <v-card-title class="headline">
              Cultura: {{ card.cultura }}
            </v-card-title>
            <v-card-subtitle class="headline">
              Data Criação: {{ card.day }}</v-card-subtitle
            >
            <hr />
            <v-card-text>
              <p>
                Total vendido: {{ card.vendido.toLocaleString() }}
                {{ card.unidade }}
              </p>
              <p>Valor vendido: {{ formatCurrency(card.valorVenda) }}</p>
              <p>Custo unitário: {{ formatCurrency(card.custo) }}</p>
              <p>Receita Bruta: {{ formatCurrency(receitaBruta) }}</p>
              <p>Custo produção: {{ formatCurrency(custoProducao) }}</p>
              <p>
                Margem bruta semanal: {{ formatCurrency(margemBrutaSemanal) }}
              </p>
              <p>
                Margem bruta mensal: {{ formatCurrency(margemBrutaMensal) }}
              </p>
              <p>Margem bruta anual: {{ formatCurrency(margemBrutaAnual) }}</p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
export default {
  name: "MargemBruta",
  mixins: [formatCurrentMixin],
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
  computed: {
    receitaBruta(data) {
      return data.cards[0].vendido * data.cards[0].valorVenda;
    },
    custoProducao(data) {
      return data.cards[0].vendido * data.cards[0].custo;
    },
    margemBrutaSemanal() {
      return this.receitaBruta - this.custoProducao;
    },
    margemBrutaMensal() {
      return this.margemBrutaSemanal * 4;
    },
    margemBrutaAnual() {
      return this.margemBrutaMensal * 12;
    },
  },
};
</script>
