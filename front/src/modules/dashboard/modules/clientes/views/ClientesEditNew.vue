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
              <v-row class="mt-0">
                <v-col cols="12" md="12">
                  <v-text-field
                    :error-messages="nomeErrors"
                    :success="!$v.form.nome.$invalid"
                    v-model.trim="$v.form.nome.$model"
                    label="Nome do cliente"
                    prepend-inner-icon="mdi-account"
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
</template>

<script>
import { required, minLength, minValue } from "vuelidate/lib/validators";
export default {
  name: "ClientesEditNew",
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
      default: false,
    },
  },
  data() {
    return {
      editouCultura: false,
      form: {
        index: 0,
        nome: "",
      },
    };
  },
  validations() {
    return {
      form: {
        nome: {
          required,
          minLength: minLength(2),
        },
      },
    };
  },
  watch: {
    editou(pValue) {
      if (!pValue) {
        this.form = {
          index: 0,
          nome: "",
        };
      }
    },
    formEditou(pValue) {
      if (pValue && pValue.length > 0) {
        this.form = {
          index: pValue[0].index,
          nome: pValue[0].nome,
        };
      }
    },
  },
  computed: {
    title() {
      console.log(this.editou);
      return this.editou ? "Editar Cliente" : "Novo Cliente";
    },
    nomeErrors() {
      const errors = [];
      const nome = this.$v.form.nome;
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
