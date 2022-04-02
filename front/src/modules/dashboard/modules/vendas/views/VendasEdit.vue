<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-flex xs12>
      <v-card class="elevation-24" outlined>
        <v-toolbar color="primary" dark>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                Editar Venda
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-btn icon dark @click="cancelar">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form>
            <v-container>
              <v-row class="mt-2">
                <v-col cols="12" md="6">
                  <v-dialog
                    ref="dateDialog"
                    :return-value.sync="form.date"
                    v-model="showDateDialog"
                    persistent
                    width="290px"
                    fullwidth
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        name="date"
                        label="Data da Venda"
                        prepend-inner-icon="mdi-calendar"
                        type="text"
                        readonly
                        :value="formattedDate"
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-date-picker
                      locale="pt-br"
                      scrollable
                      color="primary"
                      v-model="dateDialogValue"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text @click="cancelDateDialog"> Cancelar </v-btn>
                      <v-btn
                        text
                        @click="$refs.dateDialog.save(dateDialogValue)"
                      >
                        Ok
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>

                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.descricao"
                    :loading="loadingCultura"
                    :items="cultura"
                    :search-input.sync="searchCultura"
                    outlined
                    label="Produto"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.cliente"
                    :loading="loadingCliente"
                    :items="clientes"
                    :search-input.sync="searchCliente"
                    outlined
                    prepend-inner-icon="mdi-account"
                    label="Cliente"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="quantityErrors"
                    :success="!$v.form.quantidade.$invalid"
                    v-model.trim="$v.form.quantidade.$model"
                    label="Quantidade vendida"
                    :value="form.quantidade"
                    prepend-inner-icon="mdi-numeric"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="valueErrors"
                    :success="!$v.form.valor.$invalid"
                    v-model.trim="$v.form.valor.$model"
                    label="Preço unitario"
                    :value="form.valor"
                    prepend-inner-icon="mdi-cash-multiple"
                    prefix="R$"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.unidade"
                    :items="unidades"
                    label="Unidade"
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
</template>

<script>
import moment from "moment";

import { required, minValue } from "vuelidate/lib/validators";
export default {
  name: "VendasEdit",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    formEditou: {
      type: Array,
      default: () => {},
    },
  },

  data() {
    return {
      form: {
        date: moment().format("YYYY-MM-DD"),
        descricao: "Crisântemo",
        valor: 0,
        cliente: "Feira",
        unidade: "Maço",
        quantidade: 0,
        index: 0,
      },
      items: ["Fixo", "Variavel"],
      cultura: ["Crisântemo", "Gérbera", "Limonium", "Rosa"],
      clientes: ["Feira", "Floricultura do Seu João"],
      loadingCultura: false,
      loadingCliente: false,
      searchCultura: null,
      searchCliente: null,
      unidades: ["Maço", "Dúzia"],
      showDateDialog: false,
      dateDialogValue: moment().format("YYYY-MM-DD"),
      editouCultura: false,
    };
  },
  validations() {
    return {
      form: {
        quantidade: {
          required,
          minValue: minValue(0.0000001),
        },
        valor: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  watch: {
    formEditou(pValue) {
      if (pValue && pValue.length > 0) {
        this.form = {
          date: pValue[0].data,
          descricao: pValue[0].produto,
          valor: pValue[0].preco,
          cliente: pValue[0].cliente,
          unidade: pValue[0].unidade,
          quantidade: pValue[0].vendida,
          index: pValue[0].index,
        };
      }
    },
  },
  computed: {
    formattedDate() {
      return moment(this.form.date).format("DD/MM/YYYY");
    },
    quantityErrors() {
      const errors = [];
      const quantity = this.$v.form.quantidade;
      if (!quantity.$dirty) {
        return errors;
      }
      !quantity.required && errors.push("Descrição é obrigatória!");
      !quantity.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },
    valueErrors() {
      const errors = [];
      const value = this.$v.form.valor;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Valor  é obrigatório!");
      !value.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },
  },
  methods: {
    cancelDateDialog() {
      this.showDateDialog = false;
      this.dateDialogValue = this.form.date;
    },
    cancelar() {
      this.editouCultura = false;
      this.$emit("showDialogClose", this.editouCultura);
    },
    salvar() {
      this.editouCultura = false;
      console.log(this.form);
      this.$emit("showDialogClose", this.editouCultura);
    },
  },
};
</script>
