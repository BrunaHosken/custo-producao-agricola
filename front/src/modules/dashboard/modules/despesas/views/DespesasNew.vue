<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs10>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Cadastrar uma nova Despesa
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
                          label="Data da Despesa"
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
                      :items="items"
                      item-text="label"
                      item-value="id"
                      label="Tipo de Despesa"
                      return-object
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
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
                      :value="form.valor"
                      prepend-inner-icon="mdi-cash-multiple"
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
          :show="createSnackBar"
          :mensagem="this.mensagem"
          :color="color"
          @show="showSnackBar"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import despesaService from "./../services/despesa-service";
import SnackBar from "./../../../components/SnackBar.vue";
import Dialog from "./../../../components/Dialog.vue";
export default {
  name: "DespesasNew",
  components: {
    Dialog,
    SnackBar,
  },
  data() {
    return {
      valid: false,
      items: [],
      form: {
        date: moment().format("YYYY-MM-DD"),
        descricao: "",
        valor: 0,
        tipo: "",
      },
      createSnackBar: false,
      mensagem: "",
      color: "success",
      showDateDialog: false,
      dateDialogValue: moment().format("YYYY-MM-DD"),
      showClearDialog: false,
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
  async created() {
    const response = await despesaService.tipoDespesas();
    response.forEach((item) => {
      this.items.push({ label: item.DescrTipoDespesa, id: item.id });
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
    showSnackBar(data) {
      this.createSnackBar = data;
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
        descricao: "",
        valor: 0,
        tipo: this.items[0],
      };
    },
    async save() {
      try {
        await despesaService.CreateDespesa(this.form);
        this.$router.go(-1);
        this.createSnackBar = true;
        this.mensagem = "Despesa criada com sucesso!";
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      }
    },
  },
};
</script>
