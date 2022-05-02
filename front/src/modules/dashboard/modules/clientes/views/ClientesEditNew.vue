<template>
  <v-dialog v-model="showDialog" persistent max-width="600px" class="mr-2">
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
          <v-btn v-if="!editou" color="orange" class="mr-4" @click="clear">
            Limpar
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
import { required, minLength } from "vuelidate/lib/validators";
import clienteService from "./../services/cliente-service";
import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "ClientesEditNew",
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
      default: false,
    },
  },
  data() {
    return {
      mensagem: "",
      createWithError: false,
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
        this.clear();
      }
      if (pValue) {
        this.form = {
          index: this.formEditou[0].id,
          nome: this.formEditou[0].NomeCliente,
        };
      }
    },
    formEditou(pValue) {
      if (pValue && pValue.length > 0) {
        this.form = {
          index: pValue[0].id,
          nome: pValue[0].NomeCliente,
        };
      }
    },
  },
  computed: {
    title() {
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
    showSnackBarError(data) {
      this.createWithError = data;
    },
    clear() {
      this.form = {
        index: 0,
        nome: "",
      };
    },
    cancelar() {
      this.$v.$reset();
      this.editouCultura = false;
      this.clear();
      this.$emit("showDialogClose", this.editouCultura);
    },
    async salvar() {
      try {
        this.editou
          ? await clienteService.UpdateCliente(this.form)
          : await clienteService.CreateCliente(this.form);
      } catch (e) {
        this.mensagem = e.message;
        this.createWithError = true;
      } finally {
        this.editouCultura = false;
        this.$v.$reset();
        this.clear();
        this.$emit("showDialogClose", this.editouCultura);
      }
    },
  },
};
</script>
