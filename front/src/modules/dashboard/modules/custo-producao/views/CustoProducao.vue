<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth
        class="mt-5 mb-3"
        format="MM-YYYY"
        month="02"
        @period="period"
      />
    </v-flex>
    <v-flex xs12>
      <v-card elevation="24" outlined>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="success" mt-10 @click="novo"> Novo +</v-btn>
        </v-card-title>

        <v-card-title v-if="cards.length === 0">
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhuma Cultura Desenvolvida. <br />
        </v-card-title>

        <v-container v-else fluid grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="card in cards" :key="card.index" pa-4>
              <v-card elevation="24" outlined class="hover-card">
                <v-card-title class="headline justify-center" ml-5>
                  Cultura: {{ card.cultura }}
                </v-card-title>
                <v-card-subtitle class="headline text-center">
                  Terreno: {{ card.terreno }} hectares<v-spacer></v-spacer> Data
                  de Início: {{ card.day }}<v-spacer></v-spacer> Data da
                  Colheita: {{ card.colheita }}
                </v-card-subtitle>
                <hr />
                <v-card-text class="text-center">
                  <p v-for="etapa in card.etapas" :key="etapa.index">
                    Etapa {{ etapa.ordem }} | Data da Etapa: {{ etapa.data }} |
                    {{ etapa.descricao }} | {{ etapa.insumoServiço }} | Uso
                    {{ etapa.uso }} | {{ etapa.quantidade }}
                    {{ etapa.unidade }} | {{ formatCurrency(etapa.valor) }} |
                    Total:
                    {{
                      formatCurrency(totalEtapa(etapa.quantidade, etapa.valor))
                    }}
                  </p>
                </v-card-text>
                <hr />
                <v-card-text class="text-center">
                  <p>
                    Total cultura desenvolvida:
                    {{
                      formatCurrency(totalCulturaDesenvolvida(card, card.index))
                    }}
                  </p>

                  <p>
                    Quantidade estimada de produção:
                    {{ card.quantidadeProduzida.toLocaleString() }}
                    {{ card.unidade }}/hectare
                  </p>
                  <p>
                    Custo Unitário:
                    {{ formatCurrency(custoUnitario(card, card.index)) }}
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" text> Editar </v-btn>

                  <v-btn color="red accent-2" text> Excluir </v-btn>
                </v-card-actions>
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
  name: "CulturaDesenvolvida",
  mixins: [formatCurrentMixin],
  components: {
    ToolbarByMonth,
  },
  data() {
    return {
      periodoAtual: "Mensal",
      cards: [
        {
          index: 0,
          day: moment().format("DD/MM/YYYY"),
          cultura: "Crisântemo",
          terreno: 14,
          colheita: "Ainda não colhido",
          quantidadeProduzida: 14000,
          unidade: "Maços",
          etapas: [
            {
              index: 0,
              ordem: 1,
              data: moment().format("DD/MM/YYYY"),
              descricao: "Semementes ou Mudas",
              insumoServiço: "Mudas enraizadas",
              uso: "Real",
              quantidade: 420,
              unidade: "Milheiro",
              valor: 35,
              total: 0,
            },
            {
              index: 1,
              ordem: 1,
              data: moment().format("DD/MM/YYYY"),
              descricao: "Adubos e corretivos",
              insumoServiço: "Adubo foliar fosfatado",
              uso: "Previsto",
              quantidade: 8,
              unidade: "Litros",
              valor: 15,
              total: 0,
            },
            {
              index: 2,
              ordem: 1,
              data: moment().format("DD/MM/YYYY"),
              descricao: "Defensivos",
              insumoServiço: "Fungicidas",
              uso: "Real",
              quantidade: 54,
              unidade: "Quilograma/Litro",
              valor: 40,
              total: 0,
            },
          ],
        },
      ],
    };
  },
  methods: {
    novo() {
      this.$router.push("/dashboard/custo-producao/new");
    },
    custoUnitario(item, index) {
      let valorTotal =
        this.totalCulturaDesenvolvida(item, index) / item.quantidadeProduzida;
      console.log(valorTotal);
      return valorTotal;
      // Total dos custos / quantidade estimada da produção
    },
    totalCulturaDesenvolvida(item, index) {
      let valorTotal = 0;
      for (var prop in item.etapas) {
        console.log(item.etapas[prop].valor);
        console.log(item.etapas[prop].quantidade);
        valorTotal += item.etapas[prop].valor * item.etapas[prop].quantidade;
      }
      return valorTotal;
      // Total dos custos / quantidade estimada da produção
    },
    totalEtapa(quantidade, valor) {
      return quantidade * valor;
    },
    clicou(pValue) {
      console.log(pValue);
    },
    period(pValue) {
      this.periodoAtual = pValue;
    },
    receitaBruta(card, index) {
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
