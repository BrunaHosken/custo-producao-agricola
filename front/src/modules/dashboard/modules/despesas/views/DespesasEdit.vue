<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-flex xs12>
      <v-card class="elevation-24" outlined>
        <v-toolbar color="primary" dark>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                Editar Despesa
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
                  <v-select
                    v-model="form.tipo"
                    label="Tipo de Despesa"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    outlined
                    :items="items"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="descriptionErrors"
                    :success="!$v.form.descricao.$invalid"
                    v-model.trim="$v.form.descricao.$model"
                    label="Descrição da Despesa"
                    prepend-inner-icon="mdi-book-variant"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="valueErrors"
                    :success="!$v.form.valor.$invalid"
                    v-model.trim="$v.form.valor.$model"
                    label="Valor da Despesa"
                    prepend-inner-icon="mdi-cash-multiple"
                    :value="form.valor"
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
</template>

<script>
import moment from "moment";

import { required, minValue, minLength } from "vuelidate/lib/validators";
import despesaService from "./../services/despesa-service";
export default {
  name: "DespesasEdit",
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
        index: 0,
        date: moment().format("DD-MM-YYYY"),
        descricao: "",
        valor: 0,
        tipo: "",
      },
      showDateDialog: false,
      dateDialogValue: moment().format("DD-MM-YYYY"),
      items: [],
      editouCultura: false,
    };
  },
  validations() {
    return {
      form: {
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
  watch: {
    formEditou(pValue) {
      if (pValue && pValue.length > 0) {
        this.form = {
          index: pValue[0].index,
          date: pValue[0].data,
          descricao: pValue[0].name,
          valor: pValue[0].valor,
          tipo: pValue[0].tipo,
        };
      }
    },
  },
  async created() {
    const response = await despesaService.tipoDespesas();
    response.forEach((item) => {
      this.items.push(item.DescrTipoDespesa);
    });
    this.form.tipo = this.items[0];
  },
  computed: {
    formattedDate() {
      return moment(this.form.date).format("DD/MM/YYYY");
    },
    descriptionErrors() {
      const errors = [];
      const description = this.$v.form.descricao;
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
      this.dateDialogValue = this.formEditou.date;
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
