<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs10>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Cadastrar uma nova Cultura
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid">
              <v-container>
                <v-row class="mt-2">
                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="descriptionErrors"
                      :success="!$v.form.name.$invalid"
                      v-model.trim="$v.form.name.$model"
                      label="Descrição da Cultura"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secundary" class="mr-4" @click="cancel">
              Cancelar
            </v-btn>
            <v-btn
              color="orange accent-4k"
              class="mr-4"
              @click="showClearDialog = true"
            >
              Limpar
            </v-btn>
            <v-btn
              color="success"
              class="mr-4"
              :disabled="$v.$invalid"
              @click="save"
            >
              Enviar
            </v-btn>
          </v-card-actions>
        </v-card>
        <Dialog
          message="Deseja realmente limpar os dados?"
          :showDialog="showClearDialog"
          @option="option"
        />
        <SnackBar
          :show="createWithError"
          :mensagem="this.mensagem"
          color="red"
          @show="showSnackBarError"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import culturaService from "./../services/cultura-service";
import Dialog from "./../../../components/Dialog.vue";
import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "CulturasNew",
  components: {
    Dialog,
    SnackBar,
  },
  data() {
    return {
      valid: false,
      mensagem: "",
      createWithError: false,
      unidades: ["Maço", "Dúzia"],
      form: {
        name: "",
        quantidade: 0,
        unidade: "Maço",
      },

      showClearDialog: false,
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
  computed: {
    formattedDate() {
      return moment(this.form.date).format("DD/MM/YYYY");
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
      const value = this.$v.form.quantidade;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Quantidade da despesa é obrigatória!");
      !value.minValue && errors.push(`Insira um quantidade acima de 0`);
      return errors;
    },
  },
  methods: {
    showSnackBarError(data) {
      this.createWithError = data;
    },
    option(data) {
      if (data == "nao") {
        this.showClearDialog = false;
      } else {
        this.clean();
        this.showClearDialog = false;
      }
    },
    cancelDateDialog() {
      this.showDateDialog = false;
      this.dateDialogValue = this.form.date;
    },
    cancel() {
      this.$router.go(-1);
    },
    clean() {
      this.form = {
        name: "",
        quantidade: 0,
        unidade: "Maço",
      };
    },
    async save() {
      try {
        await culturaService.CreateCultura(this.form);
        this.$router.go(-1);
      } catch (e) {
        this.mensagem = e.message;
        this.createWithError = true;
      }
    },
  },
};
</script>
