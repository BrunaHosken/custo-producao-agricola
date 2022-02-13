<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title> Culturas </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="produtos"
          show-select
          item-key="name"
          multi-select
          loading="false"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.quantidade`]="{ item }">
            {{ item.quantidade.toLocaleString() }}
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
                  Editar Cultura
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
                      label="Descrição do Insumo"
                      prepend-inner-icon="mdi-book-variant"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="valueErrors"
                      :success="!$v.formEditou.quantidade.$invalid"
                      v-model.trim="$v.formEditou.quantidade.$model"
                      label="Quantidade estimada por Hectare"
                      :value="formEditou.quantidade"
                      prepend-inner-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-0">
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formEditou.tipo"
                      :items="unidades"
                      label="Unidade da Cultura"
                      prepend-inner-icon="mdi-format-list-numbered"
                      outlined
                    ></v-select>
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
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import AppFloatingButton from "./../../components/AppFloatingButton.vue";

export default {
  name: "Culturas",
  components: {
    AppFloatingButton,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      formEditou: {
        index: 0,
        descricao: "",
        quantidade: 0,
        tipo: "Maço",
      },

      selected: [],
      headers: [
        {
          text: "Cultura",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Quantidade estimada por Hectare", value: "quantidade" },
        { text: "Unidade", value: "unidade" },
      ],
      produtos: [
        {
          index: 1,
          name: "Crisântemo",
          quantidade: 14000,
          unidade: "Maço",
        },
      ],

      editou: false,
      deletou: false,
      unidades: ["Maço", "Dúzia"],
    };
  },
  validations() {
    return {
      formEditou: {
        descricao: {
          required,
          minLength: minLength(2),
        },
        quantidade: {
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
      const quantity = this.$v.formEditou.quantidade;
      if (!quantity.$dirty) {
        return errors;
      }
      !quantity.required && errors.push("Quantidade da despesa é obrigatória!");
      !quantity.minValue && errors.push(`Insira um Quantidade acima de 0`);
      return errors;
    },
  },

  methods: {
    edicaoItens(item) {
      this.editou = item;
      console.log(this.formEditou);
      console.log(this.selected);
      this.formEditou = {
        index: this.selected[0].index,
        descricao: this.selected[0].name,
        quantidade: this.selected[0].quantidade,
        tipo: this.selected[0].unidade,
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
