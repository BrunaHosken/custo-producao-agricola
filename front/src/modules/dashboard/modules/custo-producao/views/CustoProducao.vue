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
          <v-card-title>
            <v-icon size="50" color="warning" class="mr-2"
              >mdi-alert-circle</v-icon
            >
            Clique em editar para adicionar as etapas da produção <br />
          </v-card-title>
          <v-layout row wrap>
            <v-flex v-for="card in cards" :key="card.id" pa-4 xs6>
              <v-card elevation="24" outlined class="hover-card">
                <v-card-title class="headline justify-center" ml-5>
                  Cultura: {{ card.Cultura.DescrCultura }}
                </v-card-title>
                <v-card-subtitle class="headline text-center">
                  Terreno: {{ card.AreaTerrenoHectares }} hectares<v-spacer
                  ></v-spacer
                  ><span>
                    Data de Início:
                    {{ formatDateTable(card.DataInicio) }}
                  </span>
                  <v-spacer></v-spacer>
                  <span v-if="card.DataColheita != null">
                    Data da Colheita:
                    {{ formatDateTable(card.DataColheita) }}
                  </span>

                  <span v-else>
                    Data da Colheita:
                    {{ "Ainda não colhida" }}
                  </span>
                </v-card-subtitle>

                <v-card-text class="text-center">
                  <h3>
                    Total cultura desenvolvida:
                    {{
                      formatCurrency(totalCulturaDesenvolvida(card, card.id))
                    }}
                  </h3>

                  <h3>
                    Quantidade estimada de produção:
                    {{ card.QtdColhida.toLocaleString() }}
                    {{ card.Unidade }}/hectare
                  </h3>
                  <h3>
                    Custo Unitário:
                    {{ formatCurrency(custoUnitario(card, card.id)) }}
                  </h3>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" text @click="editar(card)">
                    Editar
                  </v-btn>

                  <v-btn color="red accent-2" text @click="excluir(card)">
                    Excluir
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <CustoProducaoEdit
      :showDialog="editou"
      :formEditou="culturaDesenvolvida"
      @showDialogClose="close"
    />
    <Dialog
      :message="message"
      :showDialog="showDeleteDialog"
      @option="option"
    />
  </v-layout>
</template>

<script>
import CustoProducaoEdit from "./CustoProduçãoEdit.vue";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import Dialog from "./../../../components/Dialog.vue";
import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import culturaDesenvolvidaService from "./../services/culturaDesenvolvida-service";
export default {
  name: "CulturaDesenvolvida",
  mixins: [formatCurrentMixin],
  components: {
    ToolbarByMonth,
    Dialog,
    CustoProducaoEdit,
  },
  data() {
    return {
      periodoAtual: "",
      currentDate: "",

      cards: [
        {
          AreaTerrenoHectares: 0,
          Cultura: {
            DescrCultura: "",
            QtdEstimadaPorHectare: 0,
            id: 0,
          },
          DataColheita: "",
          DataInicio: "",
          QtdColhida: 0,
          Unidade: "",
          id: 0,
        },
      ],
      message: "",
      showDeleteDialog: false,
      culturaDesenvolvida: null,
      editou: false,
    };
  },

  methods: {
    async searchculturaDesenvolvida() {
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };
      this.cards = await culturaDesenvolvidaService.culturaDesenvolvida(
        variables
      );
    },
    formatDateTable(value) {
      return moment(value.substr(0, 10)).format("DD/MM/YYYY");
    },
    close(item) {
      this.editou = item;
    },
    editar(item) {
      this.culturaDesenvolvida = item;
      this.editou = true;
    },
    option(data) {
      if (data === "sim") {
        this.showDeleteDialog = false;
      } else {
        this.showDeleteDialog = false;
      }
    },
    excluir(item) {
      this.message = `Deseja realmente excluir a cultura desenvolvida do ${item.cultura}?`;
      this.showDeleteDialog = true;
      this.culturaDesenvolvida = item;
    },
    novo() {
      this.$router.push("/dashboard/custo-producao/new");
    },
    custoUnitario(item, index) {
      let valorTotal =
        this.totalCulturaDesenvolvida(item, index) / item.QtdColhida;

      return valorTotal;
    },
    totalCulturaDesenvolvida(item, index) {
      let valorTotal = 0;
      for (var prop in item.etapas) {
        valorTotal += item.etapas[prop].valor * item.etapas[prop].quantidade;
      }
      return valorTotal;
    },
    totalEtapa(quantidade, valor) {
      return quantidade * valor;
    },
    date(pValue) {
      this.currentDate = pValue;
      this.searchculturaDesenvolvida();
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
  background: linear-gradient(rgba(85, 85, 85, 0.7), rgba(85, 85, 85, 0.7));
}
.hover-card {
  filter: brightness(1.5);
}

h3 {
  justify-content: center;
}
</style>
