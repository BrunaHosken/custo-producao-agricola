<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs10>
        <v-card class="elevation-24" outlined>
          <v-toolbar color="primary" dark>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Cadastrar uma Nova Cultura Desenvolvida
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
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValueInitial"
                        type="month"
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
                          type="month"
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
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="form.descricao"
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
                        @click="novoProduto"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Nova Cultura</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      :error-messages="valueErrors"
                      :success="!$v.form.quantidade.$invalid"
                      v-model.trim="$v.form.quantidade.$model"
                      :label="label"
                      :value="form.quantidade"
                      prepend-inner-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-select
                      v-model="form.unidade"
                      :items="unidades"
                      label="Unidade do Insumo"
                      prepend-inner-icon="mdi-format-list-numbered"
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
                <h4 class="mb-2">Etapas já adicionadas</h4>
                <v-row class="mt-0">
                  <v-subheader class="mt-0 mb-4"
                    >Adicionar nova etapa</v-subheader
                  >
                  <v-autocomplete
                    v-model="form.descricao"
                    :loading="loadingCultura"
                    :items="cultura"
                    :search-input.sync="searchCultura"
                    outlined
                    label="Etapa da Cultura"
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
                      <v-list-item-title
                        >Nova Etapa da Cultura</v-list-item-title
                      >
                    </v-list-item>
                    <v-divider slot="prepend-item" class="mt-2"></v-divider>
                  </v-autocomplete>
                  <v-btn color="success" class="ma-2"
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </v-row>
                <v-data-table
                  :headers="headers"
                  :items="form.etapas"
                  :items-per-page="5"
                  class="elevation-1"
                >
                </v-data-table>
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
        <ServicoEdit
          :showDialog="showDialogServico"
          :editou="false"
          @showDialogClose="close"
        />
        <InsumosEdit
          :showDialog="showDialogInsumo"
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
import InsumosEdit from "./../../insumos/views/InsumosEdit.vue";
import ServicoEdit from "./../../servicos/views/ServicosEdit.vue";
import Dialog from "./../../../components/Dialog.vue";
export default {
  name: "EtapasCulturaNew",
  components: {
    Dialog,
    InsumosEdit,
    ServicoEdit,
  },
  data() {
    return {
      valid: false,
      itemsEtapa: ["Insumo", "Serviço"],
      itemsUso: ["Real", "Previsto"],
      itemsServico: ["Preparo do Solo", "Calagem", "Adubação", "Plantio"],
      itemsInsumo: ["Mudas", "Calcário", "Fungicidas", "Frete"],
      headers: [
        {
          text: "Etapa",
          align: "start",
          value: "ordem",
        },
        {
          text: "Data",
          align: "start",
          value: "data",
        },
        {
          text: "Descrição",
          align: "start",
          value: "descricao",
        },
        {
          text: "Insumos/Serviços",
          align: "start",
          value: "insumoServico",
        },
        {
          text: "Quantidade",
          align: "start",
          value: "quantidade",
        },
        {
          text: "Unidade",
          align: "start",
          value: "unidade",
        },
        {
          text: "Custo Unitário",
          align: "start",
          value: "valor",
        },
        {
          text: "Custo Total",
          align: "start",
          value: "total",
        },
      ],
      form: {
        colheita: true,
        mesInicio: new Date().toISOString().substr(0, 7),
        mesFinal: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substr(0, 7),
        datePrevista: moment().format("YYYY-MM-DD"),
        descricao: "",
        tipoEtapa: "Insumo",
        tipoUso: "Real",
        quantidade: 0,
        servico: "Preparo do Solo",
        insumo: "Mudas",
        ordem: 0,
        etapas: [
          {
            index: 0,
            ordem: 1,
            data: moment().format("DD/MM/YYYY"),
            descricao: "Semementes ou Mudas",
            insumoServico: "Mudas enraizadas",
            uso: "Real",
            quantidade: 420,
            unidade: "Milheiro",
            valor: 35,
            total: 0,
          },
          {
            index: 1,
            ordem: 1,
            data: moment().format("DD/MM/YYYY"),
            descricao: "Adubos e corretivos",
            insumoServico: "Adubo foliar fosfatado",
            uso: "Previsto",
            quantidade: 8,
            unidade: "Litros",
            valor: 15,
            total: 0,
          },
          {
            index: 2,
            ordem: 1,
            data: moment().format("DD/MM/YYYY"),
            descricao: "Defensivos",
            insumoServico: "Fungicidas",
            uso: "Real",
            quantidade: 54,
            unidade: "Quilograma/Litro",
            valor: 40,
            total: 0,
          },
        ],
      },

      showDateDialogInitial: false,
      dateDialogValueInitial: new Date().toISOString().substr(0, 7),
      showDateDialogPrevista: false,
      dateDialogValuePrevista: moment().format("YYYY-MM-DD"),
      showDateDialogFinal: false,
      dateDialogValueFinal: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      )
        .toISOString()
        .substr(0, 7),
      showClearDialog: false,
      isServico: false,
      isPrevisto: false,
      showDialogServico: false,
      showDialogInsumo: false,
    };
  },
  validations() {
    return {
      form: {
        descricao: {
          required,
          minLength: minLength(2),
        },
        quantidade: {
          required,
          minValue: minValue(0.0000001),
        },
        ordem: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  watch: {
    "form.mesFinal"(pValue) {
      console.log(pValue);
    },
    "form.tipoEtapa"(pValue) {
      if (pValue === "Serviço") {
        this.isServico = true;
      } else {
        this.isServico = false;
      }
    },
    "form.tipoUso"(pValue) {
      if (pValue === "Previsto") {
        this.isPrevisto = true;
      } else {
        this.isPrevisto = false;
      }
    },
  },
  computed: {
    label() {
      return this.isServico ? "Dias/Homem" : "Quantidade";
    },
    formattedDateInitial() {
      return moment(this.form.mesInicio).format("MMMM/YYYY");
    },
    formattedDatePrevista() {
      return moment(this.form.datePrevista).format("DD/MM/YYYY");
    },
    formattedDateFinal() {
      return moment(this.form.mesFinal).format("MMMM/YYYY");
    },
    ordemErrors() {
      const errors = [];
      const value = this.$v.form.ordem;
      if (!value.$dirty) {
        return errors;
      }
      !value.required && errors.push("Valor  é obrigatório!");
      !value.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
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
    close() {
      this.showDialogServico = false;
      this.showDialogInsumo = false;
    },
    novoServico() {
      this.showDialogServico = true;
    },
    novoInsumo() {
      this.showDialogInsumo = true;
    },
    option(data) {
      if (data == "nao") {
        this.showClearDialog = false;
      } else {
        this.clean();
        this.showClearDialog = false;
      }
    },
    cancelDateDialogPrevista() {
      this.showDateDialogPrevista = false;
      this.dateDialogValuePrevista = this.form.datePrevista;
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
        mesInicio: new Date().toISOString().substr(0, 7),
        mesFinal: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substr(0, 7),
        datePrevista: moment().format("YYYY-MM-DD"),
        descricao: "",
        tipoEtapa: "Insumo",
        tipoUso: "Real",
        quantidade: 0,
        servico: "Preparo do Solo",
        insumo: "Mudas",
        ordem: 0,
      };
    },
    save() {
      console.log(this.form);
      // this.$v.$reset();
      // this.clear();
      this.$router.go(-1);
    },
  },
};
</script>
