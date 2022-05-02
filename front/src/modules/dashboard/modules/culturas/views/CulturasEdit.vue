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
                    :success="!$v.form.name.$invalid"
                    v-model.trim="$v.form.name.$model"
                    label="Descrição do Insumo"
                    prepend-inner-icon="mdi-book-variant"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="valueErrors"
                    :success="!$v.form.quantidade.$invalid"
                    v-model.trim="$v.form.quantidade.$model"
                    label="Quantidade estimada por Hectare"
                    :value="form.quantidade"
                    prepend-inner-icon="mdi-numeric"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.unidade"
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
      <SnackBar
        :show="createWithError"
        :mensagem="this.mensagem"
        color="red"
        @show="showSnackBarError"
      />
    </v-flex>
  </v-dialog>
</template>

<script>
import { required, minLength, minValue } from "vuelidate/lib/validators";
import culturaService from "./../services/cultura-service";

import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "CulturasEdit",
  components: {
    SnackBar,
  },
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
      unidades: ["Maço", "Dúzia"],
      editouCultura: false,
      mensagem: "",
      createWithError: false,
      form: {
        index: 0,
        name: "",
        quantidade: 0,
        unidade: "",
      },
    };
  },
  validations() {
    return {
      form: {
        name: {
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
  watch: {
    formEditou(pValue) {
      if (pValue && pValue.length > 0) {
        this.form = {
          index: pValue[0].id,
          name: pValue[0].DescrCultura,
          quantidade: pValue[0].QtdEstimadaPorHectare,
          unidade: pValue[0].Und,
        };
      }
    },
  },
  computed: {
    title() {
      return this.editou ? "Editar Cultura" : "Nova Cultura";
    },
    descriptionErrors() {
      const errors = [];
      const description = this.$v.form.name;
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
      const quantity = this.$v.form.quantidade;
      if (!quantity.$dirty) {
        return errors;
      }
      !quantity.required && errors.push("Quantidade é obrigatória!");
      !quantity.minValue && errors.push(`Insira um Quantidade acima de 0`);
      return errors;
    },
  },
  methods: {
    showSnackBarError(data) {
      this.createWithError = data;
    },
    cancelar() {
      this.editouCultura = false;
      this.$emit("showDialogClose", this.editouCultura);
    },
    async salvar() {
      try {
        await culturaService.UpdateCultura(this.form);
        this.editouCultura = false;
        this.$emit("showDialogClose", this.editouCultura);
      } catch (e) {
        this.mensagem = e.message;
        this.createWithError = true;
      }
    },
  },
};
</script>
