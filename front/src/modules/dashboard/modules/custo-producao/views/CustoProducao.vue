<template>
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

        <!-- -->
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
                  Terreno: {{ card.AreaTerrenoHectares }} hectare(s)<v-spacer
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
                    {{ formatCurrency(card.total || 0) }}
                  </h3>

                  <h3>
                    Quantidade estimada de produção:
                    {{ card.QtdColhida.toLocaleString() }}
                    {{ card.Unidade }}/hectare
                  </h3>
                  <h3>
                    Custo Unitário:
                    {{ formatCurrency(custoUnitario(card) || 0) }}
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
    <SnackBar
      :show="createSnackBar"
      :mensagem="this.mensagem"
      :color="color"
      @show="showSnackBar"
    />
  </v-layout>
</template>

<script>
import CustoProducaoEdit from "./CustoProduçãoEdit.vue";
import ToolbarByMonth from "./../../components/ToolbarByMonth.vue";
import Dialog from "./../../../components/Dialog.vue";
import moment from "moment";
import SnackBar from "./../../../components/SnackBar.vue";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import culturaDesenvolvidaService from "./../services/culturaDesenvolvida-service";
export default {
  name: "CulturaDesenvolvida",
  mixins: [formatCurrentMixin],

  components: {
    ToolbarByMonth,
    Dialog,
    SnackBar,
    CustoProducaoEdit,
  },
  data() {
    return {
      periodoAtual: "",
      currentDate: "",
      cards: [],
      message: "",
      showDeleteDialog: false,
      culturaDesenvolvida: null,
      editou: false,
      createSnackBar: false,
      mensagem: "",
      color: "success",
      selected: [],
    };
  },

  methods: {
    showSnackBar(data) {
      this.createSnackBar = data;
    },
    async searchculturaDesenvolvida() {
      this.cards = [];
      const variables = {
        periodSelected: this.periodoAtual,
        currentDate: this.currentDate,
      };

      const response = await culturaDesenvolvidaService.culturaDesenvolvida(
        variables
      );

      this.cards =
        await culturaDesenvolvidaService.culturaDesenvolvidaWithEtapas(
          variables
        );
    },
    formatDateTable(value) {
      return moment(value.substr(0, 10)).format("DD/MM/YYYY");
    },
    close(item) {
      this.editou = item;
      this.culturaDesenvolvida = null;
    },
    custoUnitario(item) {
      const custoUnitario = item.total / item.QtdColhida;
      item.custoUnitario = custoUnitario;
      return custoUnitario;
    },
    editar(item) {
      this.culturaDesenvolvida = item;
      this.editou = true;
    },
    async option(data) {
      if (data === "sim") {
        try {
          this.selected.etapas.forEach(async (item) => {
            console.log(item);
            if (item.servicoPrestado.length > 0)
              item.servicoPrestado.forEach(async (item) => {
                await culturaDesenvolvidaService.DeleteServicoPrestado(item);
              });
            if (item.servicoPrevisto.length > 0)
              item.servicoPrevisto.forEach(async (item) => {
                await culturaDesenvolvidaService.DeleteServicoPrevisto(item);
              });
            if (item.insumoReal.length > 0)
              item.insumoReal.forEach(async (item) => {
                await culturaDesenvolvidaService.DeleteInsumoReal(item);
              });
            if (item.insumoPrevisto.length > 0)
              item.insumoPrevisto.forEach(async (item) => {
                await culturaDesenvolvidaService.DeleteInsumoPrevisto(item);
              });
            await culturaDesenvolvidaService.DeleteCulturaEtapa(item);
          });

          await culturaDesenvolvidaService.DeleteCulturaDesenvolvida(
            this.selected
          );
          this.mensagem = "Custo de produção deletado com sucesso!";
          this.createSnackBar = true;
          this.showDeleteDialog = false;
        } catch (e) {
          this.mensagem = e.message;
          this.color = "red";
          this.createSnackBar = true;
        }
      } else {
        this.showDeleteDialog = false;
      }
    },
    excluir(item) {
      this.message = `Deseja realmente excluir a cultura desenvolvida do(a) ${item.Cultura.DescrCultura}?`;
      this.showDeleteDialog = true;
      this.culturaDesenvolvida = item;
      this.selected = item;
    },
    novo() {
      this.$router.push("/dashboard/custo-producao/new");
    },

    date(pValue) {
      this.currentDate = pValue;
      this.searchculturaDesenvolvida();
    },
    period(pValue) {
      this.periodoAtual = pValue;
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
