<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs11>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Cadastrar Cultura Desenvolvida
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid">
              <v-container>
                <v-row class="mt-0">
                  <v-col cols="12" md="4">
                    <v-dialog
                      ref="dateDialogInitial"
                      :return-value.sync="form.mesInicio"
                      v-model="showDateDialogInitial"
                      persistent
                      width="290px"
                      fullwidth
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          name="dateInitial"
                          label="Data Início"
                          prepend-inner-icon="mdi-calendar"
                          type="text"
                          readonly
                          :value="formattedDateInitial"
                          v-on="on"
                          :error-messages="initialDateErrors"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValueInitial"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="cancelDateDialogInitial">
                          Cancelar
                        </v-btn>
                        <v-btn
                          text
                          @click="
                            $refs.dateDialogInitial.save(dateDialogValueInitial)
                          "
                        >
                          Ok
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-row class="mt-0 text-center">
                      <v-subheader class="mt-2"
                        >A cultura já foi colhida?</v-subheader
                      >
                      <v-checkbox
                        v-model="form.colheita"
                        hide-details
                      ></v-checkbox>
                      <v-text-field
                        v-if="!form.colheita"
                        value="Ainda não colhido"
                        label="Data Colheita"
                        disabled
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                      <v-dialog
                        v-if="form.colheita"
                        ref="dateDialogFinal"
                        :return-value.sync="form.mesFinal"
                        v-model="showDateDialogFinal"
                        persistent
                        width="290px"
                        fullwidth
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            name="dateFinal"
                            label="Data Colheita"
                            prepend-inner-icon="mdi-calendar"
                            type="text"
                            readonly
                            :value="formattedDateFinal"
                            v-on="on"
                          ></v-text-field>
                        </template>

                        <v-date-picker
                          locale="pt-br"
                          scrollable
                          color="primary"
                          v-model="dateDialogValueFinal"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text @click="cancelDateDialogFinal">
                            Cancelar
                          </v-btn>
                          <v-btn
                            text
                            @click="
                              $refs.dateDialogFinal.save(dateDialogValueFinal)
                            "
                          >
                            Ok
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="form.culturaDescricao"
                      :loading="loadingCultura"
                      :items="cultura"
                      :search-input.sync="searchCultura"
                      outlined
                      label="Cultura"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novaCultura"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Nova Cultura</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="terrenoErrors"
                      :success="!$v.form.terreno.$invalid"
                      v-model.trim="$v.form.terreno.$model"
                      label="Total de Hectares"
                      :value="form.quantidade"
                      prepend-inner-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="12" md="6">
                    <v-text-field
                      :error-messages="valueErrors"
                      :success="!$v.form.quantidade.$invalid"
                      v-model.trim="$v.form.quantidade.$model"
                      label="Quantidade Estimada"
                      :value="form.quantidade"
                      prepend-inner-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>
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
        <CulturasEdit
          :showDialog="showDialogProduto"
          :editou="false"
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
import CulturasEdit from "./../../culturas/views/CulturasEdit.vue";
import Dialog from "./../../../components/Dialog.vue";
import formatCurrentMixin from "./../../../../../mixins/format-currency";

export default {
  name: "CustoProducaoNew",
  components: {
    Dialog,
    CulturasEdit,
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      valid: false,
      itemsUso: ["Real", "Previsto"],
      searchTable: null,
      cultura: ["Crisântemo", "Gérbera", "Limonium", "Rosa"],
      unidades: ["Maço", "Dúzia"],
      form: {
        colheita: true,
        mesInicio: moment().format("YYYY-MM-DD"),
        mesFinal: moment().add(1, "M").format("YYYY-MM-DD"),
        culturaDescricao: "Crisântemo",
        quantidade: 0,
        terreno: 0,
        unidade: "Dúzia",
      },
      showDialogProduto: false,
      showDateDialogInitial: false,
      dateDialogValueInitial: moment().format("YYYY-MM-DD"),
      showDateDialogPrevista: false,
      dateDialogValuePrevista: moment().add(1, "M").format("YYYY-MM-DD"),
      showDateDialogFinal: false,
      dateDialogValueFinal: moment().add(1, "M").format("YYYY-MM-DD"),
      showClearDialog: false,
      isServico: false,
      isPrevisto: false,
      searchCultura: null,
      loadingCultura: false,
    };
  },
  validations() {
    return {
      form: {
        quantidade: {
          required,
          minValue: minValue(0.0000001),
        },
        terreno: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  watch: {
    "form.colheita"(pValue) {
      if (!pValue) {
        this.form.mesFinal = null;
      } else {
        this.form.mesFinal = moment().add(1, "M").format("YYYY-MM-DD");
      }
    },
  },
  computed: {
    initialDateErrors() {
      const errors = [];

      if (
        this.form.mesInicio > this.form.mesFinal &&
        this.form.mesFinal !== null
      ) {
        errors.push("Data inicial é maior do que a final");
      }
      return errors;
    },

    formattedDateInitial() {
      return moment(this.form.mesInicio).format("DD/MM/YYYY");
    },
    formattedDateFinal() {
      return moment(this.form.mesFinal).format("DD/MM/YYYY");
    },

    terrenoErrors() {
      const errors = [];
      const value = this.$v.form.terreno;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Valor  é obrigatório!");
      !value.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },

    valueErrors() {
      const errors = [];
      const value = this.$v.form.quantidade;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Valor  é obrigatório!");
      !value.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },
  },
  methods: {
    formatDateTable(value) {
      return moment(value).format("DD/MM/YYYY");
    },

    close() {
      this.showDialogProduto = false;
    },
    novaCultura() {
      this.showDialogProduto = true;
    },

    option(data) {
      if (data == "nao") {
        this.showClearDialog = false;
      } else {
        this.clean();
        this.showClearDialog = false;
      }
    },

    cancelDateDialogInitial() {
      this.showDateDialogInitial = false;
      this.dateDialogValueInitial = this.form.mesInicio;
    },
    cancelDateDialogFinal() {
      this.showDateDialogFinal = false;
      this.dateDialogValueFinal = this.form.mesFinal;
    },

    cancel() {
      this.$router.go(-1);
    },

    clean() {
      this.form = {
        colheita: true,
        mesInicio: moment().format("YYYY-MM-DD"),
        mesFinal: moment().add(1, "M").format("YYYY-MM-DD"),
        culturaDescricao: "Crisântemo",
        quantidade: 0,
        terreno: 0,
      };
    },
    save() {
      // this.$v.$reset();
      // this.clear();
      console.log(this.form);
      // this.$router.go(-1);
    },
  },
};
</script>
