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
                  <h4 class="mb-2">Etapas</h4>
                  <v-data-table
                    :headers="headers"
                    :items="card.etapas"
                    :items-per-page="5"
                    class="elevation-1"
                    multi-sort
                  >
                    <template v-slot:[`item.data`]="{ item }">
                      {{ formatDateTable(item.data) }}
                    </template>
                    <template v-slot:[`item.quantidade`]="{ item }">
                      {{ item.quantidade.toLocaleString() }}
                    </template>
                    <template v-slot:[`item.valor`]="{ item }">
                      {{ formatCurrency(item.valor) }}
                    </template>
                    <template v-slot:[`item.total`]="{ item }">
                      {{
                        formatCurrency(totalEtapa(item.quantidade, item.valor))
                      }}
                    </template>
                  </v-data-table>
                </v-card-text>
                <hr />
                <v-card-text class="text-center">
                  <h3>
                    Total cultura desenvolvida:
                    {{
                      formatCurrency(totalCulturaDesenvolvida(card, card.index))
                    }}
                  </h3>

                  <h3>
                    Quantidade estimada de produção:
                    {{ card.quantidadeProduzida.toLocaleString() }}
                    {{ card.unidade }}/hectare
                  </h3>
                  <h3>
                    Custo Unitário:
                    {{ formatCurrency(custoUnitario(card, card.index)) }}
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
// import moment from "moment";
import CustoProducaoEdit from "./CustoProduçãoEdit.vue";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import Dialog from "./../../../components/Dialog.vue";
import moment from "moment";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
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
      periodoAtual: "Mensal",
      headers: [
        {
          text: "Etapa",
          align: "start",
          value: "ordem",
        },
        {
          text: "Data",
          align: "start",
          value: "data",
        },
        {
          text: "Descrição",
          align: "start",
          value: "descricao",
        },
        {
          text: "Insumos/Serviços",
          align: "start",
          value: "insumoServico",
        },
        {
          text: "Quantidade",
          align: "start",
          value: "quantidade",
        },
        {
          text: "Unidade",
          align: "start",
          value: "unidade",
        },
        {
          text: "Custo Unitário",
          align: "start",
          value: "valor",
        },
        {
          text: "Custo Total",
          align: "start",
          value: "total",
        },
      ],
      cards: [
        {
          index: 0,
          day: moment().format("YYYY-MM-DD"),
          cultura: "Crisântemo",
          terreno: 14,
          colheita: "Ainda não colhido",
          quantidadeProduzida: 14000,
          unidade: "Maços",
          etapas: [
            {
              index: 0,
              ordem: 1,
              data: moment().format("YYYY-MM-DD"),
              descricao: "Semementes ou Mudas",
              insumoServico: "Mudas enraizadas",
              uso: "Real",
              quantidade: 420,
              unidade: "Milheiro",
              valor: 35,
              total: 0,
            },
            {
              index: 1,
              ordem: 1,
              data: moment().format("YYYY-MM-DD"),
              descricao: "Adubos e corretivos",
              insumoServico: "Adubo foliar fosfatado",
              uso: "Previsto",
              quantidade: 8,
              unidade: "Litros",
              valor: 15,
              total: 0,
            },
            {
              index: 2,
              ordem: 1,
              data: moment().format("YYYY-MM-DD"),
              descricao: "Defensivos",
              insumoServico: "Fungicidas",
              uso: "Real",
              quantidade: 54,
              unidade: "Quilograma/Litro",
              valor: 40,
              total: 0,
            },
          ],
        },
      ],
      message: "",
      showDeleteDialog: false,
      culturaDesenvolvida: null,
      editou: false,
    };
  },
  methods: {
    formatDateTable(value) {
      return moment(value).format("DD/MM/YYYY");
    },
    close(item) {
      this.editou = item;
      console.log(item);
    },
    editar(item) {
      console.log(item);
      this.culturaDesenvolvida = item;
      this.editou = true;
    },
    option(data) {
      console.log(data);
      if (data === "sim") {
        console.log("deletou");
        this.showDeleteDialog = false;
      } else {
        this.showDeleteDialog = false;
      }
    },
    excluir(item) {
      console.log(item);
      this.message = `Deseja realmente a cultura desenvolvida do ${item.cultura}?`;
      this.showDeleteDialog = true;
      this.culturaDesenvolvida = item;
      console.log(this.culturaDesenvolvida);
    },
    novo() {
      this.$router.push("/dashboard/custo-producao/new");
    },
    custoUnitario(item, index) {
      let valorTotal =
        this.totalCulturaDesenvolvida(item, index) / item.quantidadeProduzida;

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
h3 {
  justify-content: center;
}
</style>
