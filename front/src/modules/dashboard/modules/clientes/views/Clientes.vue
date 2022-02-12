<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          Clientes
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="nome"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
        </v-data-table>
      </v-card>
    </v-flex>

    <v-dialog v-model="cliente" persistent max-width="600px">
      <v-flex xs12>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  {{ title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-btn icon dark @click="cliente = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-container>
                <v-row class="mt-0">
                  <v-col cols="12" md="12">
                    <v-text-field
                      :error-messages="nomeErrors"
                      :success="!$v.formEdit.nome.$invalid"
                      v-model.trim="$v.formEdit.nome.$model"
                      label="Nome do cliente"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="mb-4">
            <v-spacer></v-spacer>
            <v-btn color="secundary" class="mr-4" @click="cancelar">
              Cancelar
            </v-btn>
            <v-btn
              color="success"
              class="mr-4"
              :disabled="$v.$invalid"
              @click="salvar"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>

    <AppFloatingButton
      v-show="true"
      :itensLength="selected.length"
      @register="novoItem"
      @edicao="edicaoItens"
      @deletou="deletouItens"
    />
  </v-layout>
</template>

<script>
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";

export default {
  name: "Despesas",
  components: {
    AppFloatingButton,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      formEdit: {
        index: 0,
        nome: "",
      },
      selected: [],
      headers: [
        {
          text: "Clientes",
          align: "start",
          sortable: false,
          value: "nome",
        },
      ],
      produtos: [
        {
          index: 1,
          nome: "Feira",
        },
        {
          index: 2,
          nome: "Floricultura do Seu João",
        },
        {
          index: 3,
          nome: "Floricultura do Seu João 1",
        },
        {
          index: 4,
          nome: "Floricultura do Seu João 2",
        },
      ],
      cliente: false,
      editou: false,
      deletou: false,
    };
  },
  validations() {
    return {
      formEdit: {
        nome: {
          required,
          minLength: minLength(2),
        },
      },
    };
  },
  computed: {
    title() {
      return this.editou ? "Editar Cliente" : "Novo Cliente";
    },
    nomeErrors() {
      const errors = [];
      const nome = this.$v.formEdit.nome;
      if (!nome.$dirty) {
        return errors;
      }
      !nome.required && errors.push("Descrição é obrigatória!");
      !nome.minLength &&
        errors.push(
          `Insira pelo menos ${nome.$params.minLength.min} caracteres!`
        );
      return errors;
    },
  },

  methods: {
    novoItem() {
      this.cliente = true;
    },
    edicaoItens(item) {
      this.cliente = item;
      console.log(this.selected);
      this.editou = true;
      this.formEdit = {
        index: this.selected[0].index,
        nome: this.selected[0].nome,
      };
    },
    deletouItens(item) {
      this.deletou = item;
      console.log(this.deletou);
    },

    cancelar() {
      this.cliente = false;
    },
    salvar() {
      this.cliente = false;
      console.log(this.formEdit);
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
