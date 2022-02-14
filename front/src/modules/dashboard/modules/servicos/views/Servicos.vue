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
            label="Search"
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="name"
          :search="search"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.valor`]="{ item }">
            {{ formatCurrency(item.valor) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <v-dialog v-model="editou" persistent max-width="600px">
      <v-flex xs12>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Editar Serviço
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-btn icon dark @click="editou = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-container>
                <v-row class="mt-2">
                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="descriptionErrors"
                      :success="!$v.formEditou.descricao.$invalid"
                      v-model.trim="$v.formEditou.descricao.$model"
                      label="Descrição do Serviço"
                      prepend-inner-icon="mdi-book-variant"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="valueErrors"
                      :success="!$v.formEditou.valor.$invalid"
                      v-model.trim="$v.formEditou.valor.$model"
                      label="Valor por dia do empregado"
                      prepend-inner-icon="mdi-account-cash-outline"
                      :value="formEditou.valor"
                      prefix="R$"
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
      @edicao="edicaoItens"
      @deletou="deletouItens"
    />
  </v-layout>
</template>

<script>
import { required, minLength, minValue } from "vuelidate/lib/validators";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";

export default {
  name: "Servicos",
  components: {
    AppFloatingButton,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      formEditou: {
        descricao: "",
        valor: 0,
      },

      search: "",
      selected: [],
      headers: [
        {
          text: "Serviço",
          align: "start",
          sortable: false,
          value: "name",
        },

        { text: "Valor por dia do empregado", value: "valor" },
      ],
      produtos: [
        {
          index: 1,
          name: "Preparo do Solo",
          valor: 25,
        },
        {
          index: 2,
          name: "Calagem",
          valor: 15,
        },
        {
          index: 3,
          name: "Adubação",
          valor: 15,
        },
        {
          index: 4,
          name: "Plantio",
          valor: 15,
        },
      ],
      editou: false,
      deletou: false,
    };
  },
  validations() {
    return {
      formEditou: {
        descricao: {
          required,
          minLength: minLength(2),
        },
        valor: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  computed: {
    descriptionErrors() {
      const errors = [];
      const description = this.$v.formEditou.descricao;
      if (!description.$dirty) {
        return errors;
      }
      !description.required && errors.push("Descrição é obrigatória!");
      !description.minLength &&
        errors.push(
          `Insira pelo menos ${description.$params.minLength.min} caracteres!`
        );
      return errors;
    },
    valueErrors() {
      const errors = [];
      const value = this.$v.formEditou.valor;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Valor da despesa é obrigatória!");
      !value.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },
    value() {
      return this.produtos.reduce((a, b) => {
        return a + b.valor;
      }, 0);
    },
  },

  methods: {
    edicaoItens(item) {
      this.editou = item;
      this.formEditou = {
        index: this.selected[0].index,
        date: this.selected[0].data,
        descricao: this.selected[0].name,
        valor: this.selected[0].valor,
        tipo: this.selected[0].tipo,
      };
    },
    deletouItens(item) {
      this.deletou = item;
      console.log(this.deletou);
    },

    cancelar() {
      this.editou = false;
    },
    salvar() {
      this.editou = false;
      console.log(this.formEditou);
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
