<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card v-if="produtos.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhum Serviço criado.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Serviços
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="id"
          :search="search"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
          multi-sort
        >
          <template v-slot:[`item.ValorDiaHomem`]="{ item }">
            {{ formatCurrency(item.ValorDiaHomem) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <ServicosEdit
      :showDialog="editou"
      :formEditou="selected"
      @showDialogClose="close"
    />

    <AppFloatingButton
      v-show="true"
      :itensLength="selected.length"
      @edicao="edicaoItens"
      @deletou="deletouItens"
    />
  </v-layout>
</template>

<script>
import ServicosEdit from "./ServicosEdit.vue";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import servicoService from "./../services/servicos-service";
export default {
  name: "Servicos",
  components: {
    AppFloatingButton,
    ServicosEdit,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      search: "",
      selected: [],
      headers: [
        {
          text: "Serviço",
          align: "start",

          value: "DescrServico",
        },

        { text: "Valor por dia do empregado", value: "ValorDiaHomem" },
      ],
      produtos: [],
      editou: false,
      deletou: false,
    };
  },
  async created() {
    this.produtos = await servicoService.servico();
  },
  computed: {
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.ValorDiaHomem;
      }, 0);
    },
  },

  methods: {
    edicaoItens(item) {
      this.editou = item;
    },
    async deletouItens(item) {
      try {
        await servicoService.DeleteServico(this.selected);
      } catch (e) {
        this.mensagem = e.message;
        this.createWithError = true;
      } finally {
        this.deletou = item;
      }
    },

    close(item) {
      this.editou = item;
    },
  },
};
</script>

<style>
h3 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
}
</style>
