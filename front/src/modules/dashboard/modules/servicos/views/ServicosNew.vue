<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs10>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Cadastrar um novo Serviço
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
                      :success="!$v.form.descricao.$invalid"
                      v-model.trim="$v.form.descricao.$model"
                      label="Descrição do Serviço"
                      prepend-inner-icon="mdi-book-variant"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="valueErrors"
                      :success="!$v.form.valor.$invalid"
                      v-model.trim="$v.form.valor.$model"
                      label="Valor por dia do empregado"
                      prepend-inner-icon="mdi-account-cash-outline"
                      :value="form.valor"
                      prefix="R$"
                    ></v-text-field>
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
import servicoService from "./../services/servicos-service";
import Dialog from "./../../../components/Dialog.vue";

import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "ServicosNew",
  components: {
    Dialog,
    SnackBar,
  },
  data() {
    return {
      valid: false,

      form: {
        descricao: "",
        valor: 0,
      },

      showClearDialog: false,
      createWithError: false,
      mensagem: "",
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
  computed: {
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

    cancel() {
      this.$router.go(-1);
    },
    clean() {
      this.form = {
        descricao: "",
        valor: 0,
      };
    },
    async save() {
      try {
        await servicoService.CreateServico(this.form);
        this.$router.go(-1);
      } catch (e) {
        this.mensagem = e.message;
        this.createWithError = true;
      }
    },
  },
};
</script>
