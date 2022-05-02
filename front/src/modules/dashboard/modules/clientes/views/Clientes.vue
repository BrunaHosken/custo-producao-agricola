<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card v-if="clientesList.length === 0">
        <v-card-title>
          <v-icon size="50" color="warning" class="mr-2"
            >mdi-alert-circle</v-icon
          >
          Nenhum Cliente criado.
        </v-card-title>
      </v-card>
      <v-card v-else elevation="24" outlined>
        <v-card-title>
          Clientes
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="clientesList"
          show-select
          item-key="id"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
          multi-sort
        >
        </v-data-table>
      </v-card>
    </v-flex>

    <ClientesEditNew
      :showDialog="cliente"
      :formEditou="selected"
      :editou="editou"
      @showDialogClose="close"
    />

    <AppFloatingButton
      v-show="true"
      :itensLength="selected.length"
      @register="novoItem"
      @edicao="edicaoItens"
      @deletou="deletouItens"
    />
    <SnackBar
      :show="createWithError"
      :mensagem="this.mensagem"
      color="red"
      @show="showSnackBarError"
    />
  </v-layout>
</template>

<script>
import clienteService from "./../services/cliente-service";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";
import ClientesEditNew from "./ClientesEditNew.vue";
import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "Despesas",
  components: {
    AppFloatingButton,
    ClientesEditNew,
    SnackBar,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      selected: [],
      headers: [
        {
          text: "Clientes",
          align: "start",

          value: "NomeCliente",
        },
      ],
      clientesList: [],
      cliente: false,
      editou: false,
      deletou: false,
      createWithSuccess: false,
      mensagem: "",
      createWithError: false,
    };
  },
  async created() {
    this.clientesList = await clienteService.cliente();
  },
  methods: {
    showSnackBarSuccess(data) {
      this.createWithSuccess = data;
    },
    showSnackBarError(data) {
      this.createWithError = data;
    },
    novoItem() {
      this.cliente = true;
      this.editou = false;
    },
    async close(item) {
      this.cliente = item;
      this.editou = false;
    },
    edicaoItens(item) {
      this.cliente = item;
      this.editou = true;
    },
    async deletouItens(item) {
      try {
        await clienteService.DeleteCliente(this.selected);
      } catch (e) {
        this.mensagem = e;
        this.createWithError = true;
      } finally {
        this.deletou = item;
      }
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
