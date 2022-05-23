<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs10>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Cadastrar uma nova Venda
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid">
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
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novoProduto"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Novo Produto</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider>
                    </v-autocomplete>
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
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novoCliente"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Novo Cliente</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider
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
        <CulturasEdit
          :showDialog="showDialogProduto"
          :editou="false"
          @showDialogClose="close"
        />
        <ClientesEditNew
          :showDialog="showDialogCliente"
          @showDialogClose="close"
        />
        <Dialog
          message="Deseja realmente limpar os dados?"
          :showDialog="showClearDialog"
          @option="option"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import ClientesEditNew from "./../../clientes/views/ClientesEditNew.vue";
import CulturasEdit from "./../../culturas/views/CulturasEdit.vue";
import Dialog from "./../../../components/Dialog.vue";
import clienteService from "./../../clientes/services/cliente-service";
export default {
  name: "VendasNew",
  components: {
    Dialog,
    ClientesEditNew,
    CulturasEdit,
  },
  data() {
    return {
      valid: false,
      items: ["Fixo", "Variavel"],
      cultura: ["Crisântemo"],
      clientes: [],
      loadingCultura: false,
      loadingCliente: false,
      searchCultura: null,
      searchCliente: null,
      unidades: ["Maço", "Dúzia"],
      form: {
        date: moment().format("YYYY-MM-DD"),
        descricao: "Crisântemo",
        valor: 0,
        cliente: "",
        unidade: "Maço",
        quantidade: 0,
      },

      showDateDialog: false,
      dateDialogValue: moment().format("YYYY-MM-DD"),
      showClearDialog: false,
      showDialogCliente: false,
      showDialogProduto: false,
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
  async created() {
    const response = await clienteService.cliente();
    response.forEach((item) => {
      this.clientes.push(item.NomeCliente);
    });
    this.form.cliente = this.clientes[0];
  },
  methods: {
    close() {
      this.showDialogCliente = false;
      this.showDialogProduto = false;
    },
    novoProduto() {
      this.showDialogProduto = true;
    },
    novoCliente() {
      this.showDialogCliente = true;
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
        date: moment().format("YYYY-MM-DD"),
        descricao: "Crisântemo",
        valor: 0,
        cliente: this.clientes[0],
        unidade: "Maço",
        quantidade: 0,
      };
    },
    save() {
      // this.$v.$reset();
      // this.clear();
      this.$router.go(-1);
    },
  },
};
</script>
