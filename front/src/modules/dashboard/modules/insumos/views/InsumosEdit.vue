<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
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
          <v-btn icon dark @click="cancelar">
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
                    :success="!$v.form.descricao.$invalid"
                    v-model.trim="$v.form.descricao.$model"
                    label="Descrição do Insumo"
                    prepend-inner-icon="mdi-book-variant"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.tipo"
                    label="Tipo de Insumo"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    outlined
                    :items="items"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.unidade"
                    :items="unidades"
                    label="Unidade do Insumo"
                    prepend-inner-icon="mdi-format-list-numbered"
                    outlined
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="valueErrors"
                    :success="!$v.form.valor.$invalid"
                    v-model.trim="$v.form.valor.$model"
                    label="Valor do Insumo"
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
import { required, minLength, minValue } from "vuelidate/lib/validators";
export default {
  name: "InsumosEdit",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    formEditou: {
      type: Array,
      default: () => {},
    },
    editou: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editouCultura: false,
      form: {
        index: 0,
        descricao: "",
        valor: 0,
        tipo: "Sementes ou Mudas",
        unidade: "Milheiro",
      },
      items: [
        "Sementes ou Mudas",
        "Adubos ou Corretivos",
        "Defensivos",
        "Materiais",
      ],
      unidades: [
        "Milheiro",
        "Toneladas",
        "Quilograma/Litro",
        "Maço",
        "Quilograma",
        "Litros",
        "Quilowatt",
      ],
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
          descricao: pValue[0].name,
          valor: pValue[0].preco,
          tipo: pValue[0].tipo,
          unidade: pValue[0].unidade,
        };
      }
    },
  },
  computed: {
    title() {
      return this.editou ? "Editar Insumo" : "Novo Insumo";
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
      const quantity = this.$v.form.valor;
      if (!quantity.$dirty) {
        return errors;
      }
      !quantity.required && errors.push("Valor é obrigatório!");
      !quantity.minValue && errors.push(`Insira um Quantidade acima de 0`);
      return errors;
    },
  },
  methods: {
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
