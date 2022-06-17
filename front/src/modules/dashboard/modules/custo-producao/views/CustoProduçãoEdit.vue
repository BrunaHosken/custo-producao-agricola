<template>
  <v-dialog v-model="showDialog" persistent max-width="1200px">
    <v-flex xs12>
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
                <v-col cols="12" md="6                                    ">
                  <v-autocomplete
                    v-model="form.culturaDescricao"
                    :loading="loadingCultura"
                    :items="cultura"
                    item-text="label"
                    item-value="id"
                    :search-input.sync="searchCultura"
                    outlined
                    label="Cultura"
                    return-object
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
              <v-row class="mt-4">
                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="valueErrors"
                    :success="!$v.form.quantidade.$invalid"
                    v-model.trim="$v.form.quantidade.$model"
                    :label="labelQuantidade"
                    :value="form.quantidade"
                    prepend-inner-icon="mdi-numeric"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.unidade"
                    label="Unidade da Cultura"
                    prepend-inner-icon="mdi-format-list-numbered"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>

              <hr />
              <v-card-title>
                Etapas da Cultura
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchTable"
                  append-icon="mdi-magnify"
                  label="Pesquisar"
                  hide-details
                ></v-text-field>
              </v-card-title>
              <div v-if="adicionarNovaEtapa">
                <v-row class="mt-2">
                  <v-col cols="12" md="4">
                    <v-text-field
                      :error-messages="descriptionEtapaErrors"
                      :success="!$v.formEtapa.descricao.$invalid"
                      v-model.trim="$v.formEtapa.descricao.$model"
                      label="Descrição da Etapa"
                      prepend-inner-icon="mdi-book-variant"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :error-messages="ordemErrors"
                      :success="!$v.formEtapa.ordem.$invalid"
                      v-model.trim="$v.formEtapa.ordem.$model"
                      label="Ordem da Etapa"
                      prepend-inner-icon="mdi-order-numeric-ascending"
                      required
                      suffix="º"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="12" md="4">
                    <v-dialog
                      ref="dateDialogInitialEtapa"
                      :return-value.sync="formEtapa.mesInicio"
                      v-model="showDateDialogInitialEtapa"
                      persistent
                      width="290px"
                      fullwidth
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          name="dateInitial"
                          label="Mês Inicial"
                          prepend-inner-icon="mdi-calendar"
                          type="text"
                          readonly
                          :value="formattedDateInitialEtapa"
                          v-on="on"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValueInitialEtapa"
                        type="month"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="cancelDateDialogInitialEtapa">
                          Cancelar
                        </v-btn>
                        <v-btn
                          text
                          @click="
                            $refs.dateDialogInitialEtapa.save(
                              dateDialogValueInitialEtapa
                            )
                          "
                        >
                          Ok
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-dialog
                      ref="dateDialogFinalEtapa"
                      :return-value.sync="formEtapa.mesFinal"
                      v-model="showDateDialogFinalEtapa"
                      persistent
                      width="290px"
                      fullwidth
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          name="dateFinal"
                          label="Mês Final"
                          prepend-inner-icon="mdi-calendar"
                          type="text"
                          readonly
                          :value="formattedDateFinalEtapa"
                          v-on="on"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValueFinalEtapa"
                        type="month"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="cancelDateDialogFinalEtapa">
                          Cancelar
                        </v-btn>
                        <v-btn
                          text
                          @click="
                            $refs.dateDialogFinalEtapa.save(
                              dateDialogValueFinalEtapa
                            )
                          "
                        >
                          Ok
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formEtapa.tipoEtapa"
                      :items="itemsEtapa"
                      label="Tipo da Etapa"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formEtapa.tipoUso"
                      :items="itemsUso"
                      label="Tipo de Uso"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="12" md="4" v-show="!isPrevisto">
                    <v-dialog
                      ref="dateDialogPrevista"
                      :return-value.sync="formEtapa.datePrevista"
                      v-model="showDateDialogPrevista"
                      persistent
                      width="290px"
                      fullwidth
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          name="datePrevista"
                          label="Data da Etapa"
                          prepend-inner-icon="mdi-calendar"
                          type="text"
                          readonly
                          :value="formattedDatePrevista"
                          v-on="on"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValuePrevista"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="cancelDateDialogPrevista">
                          Cancelar
                        </v-btn>
                        <v-btn
                          text
                          @click="
                            $refs.dateDialogPrevista.save(
                              dateDialogValuePrevista
                            )
                          "
                        >
                          Ok
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :error-messages="valueEtapaErrors"
                      :success="!$v.formEtapa.quantidade.$invalid"
                      v-model.trim="$v.formEtapa.quantidade.$model"
                      :label="label"
                      :value="formEtapa.quantidade"
                      prepend-inner-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" v-show="isServico">
                    <v-select
                      v-model="formEtapa.servico"
                      :items="itemsServico"
                      label="Serviço"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novoServico"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Novo Serviço</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4" v-show="!isServico">
                    <v-select
                      v-model="formEtapa.insumo"
                      :items="itemsInsumo"
                      label="Insumo"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novoInsumo"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Novo Insumo</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider
                    ></v-select>
                  </v-col>
                </v-row>
              </div>
              <v-row v-if="adicionarNovaEtapa" class="mt-0 mb-3">
                <v-spacer></v-spacer>
                <v-btn color="secundary" class="mr-4 ma-2" @click="cancelEtapa">
                  Cancelar
                </v-btn>

                <v-btn
                  color="success"
                  class="ma-2"
                  title="Adicionar"
                  :disabled="$v.$invalid"
                  @click="salvarEtapa"
                  >Salvar</v-btn
                >
              </v-row>
              <v-row v-if="!adicionarNovaEtapa" class="mt-0 mb-3">
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  class="ma-2"
                  title="Adicionar"
                  @click="adicionarEtapa"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
                <v-btn
                  color="warning"
                  class="ma-2"
                  title="Editar"
                  :disabled="selected.length === 0 || selected.length > 1"
                  @click="editarEtapa"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
                <v-btn
                  color="error"
                  class="ma-2"
                  title="Excluir"
                  :disabled="selected.length === 0"
                  @click="excluirEtapa"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </v-row>
              <v-data-table
                v-model="selected"
                v-if="!adicionarNovaEtapa"
                :search="searchTable"
                :headers="headers"
                :items="form.etapas"
                :items-per-page="5"
                class="elevation-1"
                multi-sort
                multi-select
                show-select
                item-key="index"
              >
                <template v-slot:[`item.ordem`]="{ item }">
                  {{ item.ordem }}º
                </template>

                <!-- <template v-slot:[`item.quantidade`]="{ item }">
                  {{ item.quantidade.toLocaleString() }}
                </template> -->
                <template v-slot:[`item.valor`]="{ item }">
                  {{ formatCurrency(item.valor) }}
                </template>
                <template v-slot:[`item.total`]="{ item }">
                  {{
                    formatCurrency(calculaTotal(item.valor, item.quantidade))
                  }}
                </template>
              </v-data-table>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="!adicionarNovaEtapa">
          <v-spacer></v-spacer>
          <v-btn color="secundary" class="mr-4" @click="cancelar">
            Cancelar
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
    </v-flex>
  </v-dialog>
</template>

<script>
import moment from "moment";
import { required, minLength, minValue } from "vuelidate/lib/validators";
import CulturasEdit from "./../../culturas/views/CulturasEdit.vue";
import culturaService from "./../../culturas/services/cultura-service.js";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import InsumosEdit from "./../../insumos/views/InsumosEdit.vue";
import ServicoEdit from "./../../servicos/views/ServicosEdit.vue";
export default {
  name: "CustoProducaoEdit",
  components: {
    CulturasEdit,
    InsumosEdit,
    ServicoEdit,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    formEditou: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [formatCurrentMixin],
  data() {
    return {
      valid: false,
      itemsEtapa: ["Insumo", "Serviço"],
      itemsUso: ["Real", "Previsto"],
      searchTable: null,
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
      cultura: [],
      etapas: [
        "Adubo foliar fosfatado",
        "Espalhante adesivo",
        "Fitilho",
        "Fungicidas",
        "Irrigação",
        "Mudas enraizadas",
      ],
      form: {
        mesInicio: moment().format("YYYY-MM-DD"),
        mesFinal: moment().add(1, "M").format("YYYY-MM-DD"),
        colheita: false,
        culturaDescricao: "",
        quantidade: 0,
        terreno: 0,
        unidade: "Dúzia",
        etapas: [],
      },
      showDialogProduto: false,
      showDateDialogInitial: false,
      dateDialogValueInitial: moment().format("YYYY-MM-DD"),
      showDateDialogInitialEtapa: false,
      dateDialogValueInitialEtapa: new Date().toISOString().substr(0, 7),
      showDateDialogPrevista: false,
      dateDialogValuePrevista: moment().add(1, "M").format("YYYY-MM-DD"),
      showDateDialogFinal: false,
      dateDialogValueFinal: moment().add(1, "M").format("YYYY-MM-DD"),
      showDateDialogFinalEtapa: false,
      dateDialogValueFinalEtapa: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      )
        .toISOString()
        .substr(0, 7),
      showClearDialog: false,
      isServico: false,
      isPrevisto: false,
      searchCultura: null,
      searchEtapa: null,
      loadingCultura: false,
      loadingEtapa: false,
      showDialogEtapas: false,
      adicionarNovaEtapa: false,
      formEtapa: {
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
      },

      itemsServico: ["Preparo do Solo", "Calagem", "Adubação", "Plantio"],
      itemsInsumo: ["Mudas", "Calcário", "Fungicidas", "Frete", "Fitilho"],
      clearEtapa: false,
      showDialogServico: false,
      showDialogInsumo: false,
      editouEtapaCultura: false,
      selected: [],
      editouCustoProducao: false,
    };
  },
  validations() {
    // formEtapa: {
    //   descricao: {
    //     required,
    //     minLength: minLength(2),
    //   },
    //   quantidade: {
    //     required,
    //     minValue: minValue(0.0000001),
    //   },
    //   ordem: {
    //     required,
    //     minValue: minValue(0.0000001),
    //   },
    // },
    const validators = {
      form: {
        terreno: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
    if (this.colheita) {
      return validators.form;
    }
    return {
      form: {
        ...validators.form,
        quantidade: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  async created() {
    const data = await culturaService.cultura();
    data.forEach((item) => {
      this.cultura.push({
        label: item.DescrCultura,
        id: item.id,
        quantidade: item.QtdEstimadaPorHectare,
        unidade: item.Und,
      });
    });
    this.form.culturaDescricao = this.cultura[0];
  },
  watch: {
    showDialog(pValue) {
      if (pValue !== false) {
        this.preencheForm();
      }
    },
    "form.colheita"(pValue) {
      if (!pValue && pValue !== undefined) {
        this.form.mesFinal = null;
        this.form.quantidade =
          this.form.culturaDescricao.QtdEstimadaPorHectare * this.form.terreno;
        this.$v.$reset();
      } else {
        this.form.mesFinal = moment(this.form.mesInicio)
          .add(1, "M")
          .format("YYYY-MM-DD");

        this.form.quantidade = 0;
      }
    },
    "form.terreno"(pValue) {
      if (!this.form.colheita) {
        this.form.quantidade = this.form.culturaDescricao.quantidade * pValue;
      }
    },
    "form.culturaDescricao"(pValue) {
      if (pValue && pValue !== null) {
        this.form.unidade = pValue.Und;
      }
    },
    formEditou(pValue) {
      if (pValue && pValue !== null) {
        this.preencheForm();
      }
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
    formattedDatePrevista() {
      return moment(this.formEtapa.datePrevista).format("DD/MM/YYYY");
    },
    labelQuantidade() {
      return this.form.colheita ? "Quantidade Colhida" : "Quantidade Estimada";
    },
    label() {
      return this.isServico ? "Dias/Homem" : "Quantidade";
    },
    formattedDateInitialEtapa() {
      return moment(this.formEtapa.mesInicio).format("MM/YYYY");
    },
    formattedDateInitial() {
      return moment(this.form.mesInicio).format("DD/MM/YYYY");
    },
    formattedDateFinal() {
      return moment(this.form.mesFinal).format("DD/MM/YYYY");
    },
    formattedDateFinalEtapa() {
      return moment(this.formEtapa.mesFinal).format("MM/YYYY");
    },
    // ordemErrors() {
    //   const errors = [];
    //   const value = this.$v.formEtapa.ordem;
    //   if (!value.$dirty) {
    //     return errors;
    //   }
    //   !value.required && errors.push("Valor  é obrigatório!");
    //   !value.minValue && errors.push(`Insira um valor acima de 0`);
    //   return errors;
    // },
    // descriptionEtapaErrors() {
    //   const errors = [];
    //   const description = this.$v.formEtapa.descricao;
    //   if (!description.$dirty) {
    //     return errors;
    //   }
    //   !description.required && errors.push("Descrição é obrigatória!");
    //   !description.minLength &&
    //     errors.push(
    //       `Insira pelo menos ${description.$params.minLength.min} caracteres!`
    //     );
    //   return errors;
    // },
    // valueEtapaErrors() {
    //   const errors = [];
    //   const value = this.$v.formEtapa.quantidade;
    //   if (!value.$dirty) {
    //     return errors;
    //   }
    //   !value.required && errors.push("Valor  é obrigatório!");
    //   !value.minValue && errors.push(`Insira um valor acima de 0`);
    //   return errors;
    // },
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
    novoServico() {
      this.showDialogServico = true;
    },
    novoInsumo() {
      this.showDialogInsumo = true;
    },
    cancelDateDialogInitialEtapa() {
      this.showDateDialogInitialEtapa = false;
      this.dateDialogValueInitialEtapa = this.formEtapa.mesInicio;
    },
    salvarEtapa() {
      this.adicionarNovaEtapa = false;
      this.$v.$reset();
    },
    adicionarEtapa() {
      this.adicionarNovaEtapa = true;
    },
    editarEtapa() {
      console.log(this.formEtapa);
    },
    excluirEtapa() {
      console.log(this.formEtapa);
    },
    preencheForm() {
      this.form = {
        mesInicio: moment(this.formEditou.DataInicio.substr(0, 10)).format(
          "YYYY-MM-DD"
        ),
        unidade: this.formEditou.Cultura.Und,
        terreno: this.formEditou.AreaTerrenoHectares,
        quantidade: this.formEditou.QtdColhida,
        culturaDescricao: this.formEditou.Cultura,
        colheita: this.formEditou.DataColheita !== null ? true : false,
        //etapas: this.formEditou.etapas,
      };
      if (this.formEditou.DataColheita !== null) {
        this.form.mesFinal = moment(
          this.formEditou.DataColheita.substr(0, 10)
        ).format("YYYY-MM-DD");
        this.dateDialogValueFinal = this.form.mesInicio;
        this.dateDialogValueFinal = moment(
          this.formEditou.DataColheita.substr(0, 10)
        ).format("YYYY-MM-DD");
      }
      this.dateDialogValueInitial = moment(
        this.formEditou.DataInicio.substr(0, 10)
      ).format("YYYY-MM-DD");
    },
    cancelar() {
      this.editouCustoProducao = false;
      this.$emit("showDialogClose", this.editouCustoProducao);
      this.clean();
    },
    salvar() {
      this.editouCustoProducao = false;

      this.$emit("showDialogClose", this.editouCustoProducao);
      this.clean();
    },
    calculaTotal(valor, quantidade) {
      return valor * quantidade;
    },

    deleteItem(item) {
      console.log(item);
    },
    close() {
      this.showDialogProduto = false;
      this.showDialogEtapas = false;
      this.showDialogInsumo = false;
    },
    novaCultura() {
      this.showDialogProduto = true;
    },
    novaEtapa() {
      this.showDialogEtapas = true;
    },

    cancelDateDialogPrevista() {
      this.showDateDialogPrevista = false;
      this.dateDialogValuePrevista = this.formEtapa.datePrevista;
    },
    cancelDateDialogFinalEtapa() {
      this.showDateDialogFinalEtapa = false;
      this.dateDialogValueFinalEtapa = this.formEtapa.mesFinal;
    },
    cancelEtapa() {
      this.cleanEtapa();
      this.adicionarNovaEtapa = false;
      this.$v.$reset();
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
    cleanEtapa() {
      this.formEtapa = {
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
      this.clearEtapa = false;
    },
    clean() {
      this.form = {
        colheita: false,
        mesInicio: moment().format("YYYY-MM-DD"),
        mesFinal: moment().add(1, "M").format("YYYY-MM-DD"),
        culturaDescricao: "",
        quantidade: 0,
        terreno: 0,
        unidade: "Dúzia",
        etapas: [],
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
