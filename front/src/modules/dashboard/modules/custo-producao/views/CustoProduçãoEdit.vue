<template>
  <v-dialog v-model="showDialog" persistent max-width="1200px">
    <v-flex xs12>
      <v-card class="elevation-24" outlined>
        <v-toolbar color="primary" dark>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                Editar Cultura Desenvolvida
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-toolbar>

        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <div v-if="!adicionarNovaEtapa">
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
                          :error-messages="initialDateErrors"
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
                  <v-col cols="12" md="6">
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
              </div>
              <div v-if="adicionarNovaEtapa">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secundary"
                    class="mr-4 ma-2"
                    @click="cancelEtapa"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="warning"
                    class="mr-4 ma-2"
                    @click="editarEtapaCadastrada(selected)"
                  >
                    Editar Etapa
                  </v-btn>
                  <v-btn
                    color="success"
                    class="mr-4 ma-2"
                    @click="criarInsumoServico(selected)"
                  >
                    Criar Insumo/Serviço
                  </v-btn>
                </v-card-title>

                <h1
                  v-if="selected[0].insumoPrevisto.length > 0"
                  class="headline justify-center ml-5 mt-5"
                >
                  Insumos Previstos Cadastrados
                </h1>
                <v-layout row wrap>
                  <v-flex
                    v-for="insumo in selected[0].insumoPrevisto"
                    pa-4
                    xs6
                    :key="insumo.id"
                  >
                    <v-card elevation="24" outlined class="hover-card">
                      <v-card-title class="headline justify-center" ml-5>
                        Insumo: {{ insumo.Insumo.DescrInsumo }}
                      </v-card-title>
                      <v-card-subtitle class="headline text-center">
                        <span>
                          Tipo do Insumo:
                          {{ insumo.Insumo.TipoInsumo.NomeTipo }}</span
                        ><br />
                        <span>
                          Preço do Insumo:
                          {{ formatCurrency(insumo.Insumo.PrecoUnit) }}</span
                        ><br />
                        <span>
                          Unidade do Insumo:
                          {{ insumo.Insumo.Und }} </span
                        ><br />
                        <span>
                          Quantidade Prevista:
                          {{ insumo.Qtd }}
                        </span>
                      </v-card-subtitle>
                      <v-card-actions class="mb-4">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="warning"
                          text
                          class="mr-4 ma-2"
                          @click="editarInsumoServico(insumo, false, true)"
                        >
                          Editar Insumo
                        </v-btn>
                        <v-btn
                          color="red"
                          text
                          class="mr-4 ma-2"
                          @click="excluirInsumoServico(insumo, false, true)"
                        >
                          Excluir Insumo
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>

                <h1
                  v-if="selected[0].insumoReal.length > 0"
                  class="headline justify-center ml-5 mt-5"
                >
                  Insumos Prestados Cadastrados
                </h1>
                <v-layout row wrap>
                  <v-flex
                    v-for="insumo in selected[0].insumoReal"
                    pa-4
                    xs6
                    :key="insumo.id"
                  >
                    <v-card elevation="24" outlined class="hover-card">
                      <v-card-title class="headline justify-center" ml-5>
                        Insumo: {{ insumo.Insumo.DescrInsumo }}
                      </v-card-title>
                      <v-card-subtitle class="headline text-center">
                        <span>
                          Tipo do Insumo:
                          {{ insumo.Insumo.TipoInsumo.NomeTipo }}</span
                        ><br />
                        <span>
                          Preço do Insumo:
                          {{ formatCurrency(insumo.Insumo.PrecoUnit) }}</span
                        ><br />
                        <span>
                          Unidade do Insumo:
                          {{ insumo.Insumo.Und }} </span
                        ><br />
                        <span>
                          Quantidade Utilizada:
                          {{ insumo.Qtd }}
                        </span>
                        <br />
                        <span>
                          Data Prestada:
                          {{ formatTable(insumo.Data) }}
                        </span>
                      </v-card-subtitle>
                      <v-card-actions class="mb-4">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="warning"
                          text
                          class="mr-4 ma-2"
                          @click="editarInsumoServico(insumo, false, false)"
                        >
                          Editar Insumo
                        </v-btn>
                        <v-btn
                          color="red"
                          text
                          class="mr-4 ma-2"
                          @click="excluirInsumoServico(insumo, false, false)"
                        >
                          Excluir Insumo
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>

                <h1
                  v-if="selected[0].servicoPrestado.length > 0"
                  class="headline justify-center ml-5 mt-5"
                >
                  Serviços Prestados Cadastrados
                </h1>
                <v-layout row wrap>
                  <v-flex
                    v-for="servico in selected[0].servicoPrestado"
                    pa-4
                    xs6
                    :key="servico.id"
                  >
                    <v-card elevation="24" outlined class="hover-card">
                      <v-card-title class="headline justify-center" ml-5>
                        Serviço: {{ servico.Servico.DescrServico }}
                      </v-card-title>
                      <v-card-subtitle class="headline text-center">
                        <span>
                          Preço do Serviço:
                          {{ formatCurrency(servico.Servico.ValorDiaHomem) }}
                          Homem/Dia</span
                        ><br />

                        <span>
                          Dias Utilizados:
                          {{ servico.DiasHomem }} Homem/Dia
                        </span>
                        <br />
                        <span>
                          Data Prestada:
                          {{ formatTable(servico.Data) }}
                        </span>
                      </v-card-subtitle>
                      <v-card-actions class="mb-4">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="warning"
                          text
                          class="mr-4 ma-2"
                          @click="editarInsumoServico(servico, true, false)"
                        >
                          Editar Serviço
                        </v-btn>
                        <v-btn
                          color="red"
                          text
                          class="mr-4 ma-2"
                          @click="excluirInsumoServico(servico, true, false)"
                        >
                          Excluir Serviço
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>

                <h1
                  v-if="selected[0].servicoPrevisto.length > 0"
                  class="headline justify-center ml-5 mt-5"
                >
                  Serviços Previstos Cadastrados
                </h1>
                <v-layout row wrap>
                  <v-flex
                    v-for="servico in selected[0].servicoPrevisto"
                    pa-4
                    xs6
                    :key="servico.id"
                  >
                    <v-card elevation="24" outlined class="hover-card">
                      <v-card-title class="headline justify-center" ml-5>
                        Serviço: {{ servico.Servico.DescrServico }}
                      </v-card-title>
                      <v-card-subtitle class="headline text-center">
                        <span>
                          Preço do Serviço:
                          {{ formatCurrency(servico.Servico.ValorDiaHomem) }}
                          Homem/Dia</span
                        ><br />

                        <span>
                          Dias Previstos:
                          {{ servico.DiasHomem }} Homem/Dia
                        </span>
                        <br />
                      </v-card-subtitle>
                      <v-card-actions class="mb-4">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="warning"
                          text
                          class="mr-4 ma-2"
                          @click="editarInsumoServico(servico, true, true)"
                        >
                          Editar Serviço
                        </v-btn>
                        <v-btn
                          color="red"
                          text
                          class="mr-4 ma-2"
                          @click="excluirInsumoServico(servico, true, true)"
                        >
                          Excluir Serviço
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
              </div>

              <v-row v-if="!adicionarNovaEtapa" class="mt-0 mb-3">
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  class="ma-2"
                  title="Adicionar"
                  @click="adicionarNovaEtapaCultura"
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
                item-key="id"
              >
                <template v-slot:[`item.NumEtapa`]="{ item }">
                  {{ item.NumEtapa }}º
                </template>
                <template v-slot:[`item.MesInicio`]="{ item }">
                  {{ formatMonthTable(item.MesInicio) }}
                </template>
                <template v-slot:[`item.MesFim`]="{ item }">
                  {{ formatMonthTable(item.MesFim) }}
                </template>
                <template v-slot:[`item.total`]="{ item }">
                  {{ formatCurrency(item.total) }}
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

      <SnackBar
        :show="createSnackBar"
        :mensagem="this.mensagem"
        :color="color"
        @show="showSnackBar"
      />
      <Dialog
        :message="message"
        :showDialog="showDeleteDialog"
        @option="option"
      />
      <Dialog
        :message="messageInsumoServico"
        :showDialog="showDeleteInsumoServicoDialog"
        @option="optionInsumoServico"
      />
      <Etapas
        :showDialog="cadastrarEditarEtapa"
        :etapa="formEtapa"
        :editou="editou"
        :culturaDesenvolvidaId="culturaDesenvolvidaId"
        :etapasLength="etapasLength"
        @showDialogClose="closeEtapaCadastrada"
      />
      <InsumoServico
        :showDialog="cadastrarEditarInsumoServico"
        :servicoInsumo="formServicoInsumo"
        :servico="isServico"
        :previsto="isPrevisto"
        :editou="editouServicoInsumo"
        :culturaEtapaId="culturaEtapaId"
        @showDialogClose="closeServicoInsumo"
      />
    </v-flex>
  </v-dialog>
</template>

<script>
import moment from "moment";
import { required, minValue } from "vuelidate/lib/validators";
import CulturasEdit from "./../../culturas/views/CulturasEdit.vue";
import culturaService from "./../../culturas/services/cultura-service.js";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import SnackBar from "./../../../components/SnackBar.vue";
import culturaDesenvolvidaService from "./../services/culturaDesenvolvida-service.js";
import insumoServicoService from "./../services/culturaDesenvolvida-service";
import Etapas from "./Etapas.vue";
import InsumoServico from "./InsumoServico.vue";
import Dialog from "./../../../components/Dialog.vue";

export default {
  name: "CustoProducaoEdit",
  components: {
    CulturasEdit,
    SnackBar,
    Etapas,
    InsumoServico,
    Dialog,
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
      message: "",
      showDeleteDialog: false,
      searchTable: null,
      headers: [
        {
          text: "Etapa",
          align: "start",
          value: "NumEtapa",
        },
        {
          text: "Mês Início",
          align: "start",
          value: "MesInicio",
        },
        {
          text: "Mês Final",
          align: "start",
          value: "MesFim",
        },
        {
          text: "Descrição",
          align: "start",
          value: "DescrEtapa",
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
        id: 0,
        etapas: [],
      },
      isServico: false,
      isPrevisto: false,
      showDialogProduto: false,
      showDateDialogInitial: false,
      dateDialogValueInitial: moment().format("YYYY-MM-DD"),
      showDateDialogFinal: false,
      dateDialogValueFinal: moment().add(1, "M").format("YYYY-MM-DD"),
      showClearDialog: false,
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
        ordem: 0,
      },
      formServicoInsumo: {
        datePrevista: moment().format("YYYY-MM-DD"),
        tipoEtapa: "Insumo",
        tipoUso: "Real",
        quantidade: 0,
        servico: "",
        insumo: "",
      },
      editouServicoInsumo: false,
      culturaDesenvolvidaId: null,
      culturaEtapaId: null,
      clearEtapa: false,
      editouEtapaCultura: false,
      selected: [],
      editouCustoProducao: false,
      createSnackBar: false,
      mensagem: "",
      color: "success",
      cadastrarEditarEtapa: false,
      editou: false,
      etapasLength: 0,
      cadastrarEditarInsumoServico: false,
      messageInsumoServico: "",
      showDeleteInsumoServicoDialog: false,
      excludedInsumoServico: null,
      excludedServico: false,
      excludedPrevisto: false,
    };
  },
  validations() {
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
        QtdEstimadaPorHectare: item.QtdEstimadaPorHectare,
        Und: item.Und,
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
        this.form.quantidade =
          this.form.culturaDescricao.QtdEstimadaPorHectare * pValue;
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
  },
  computed: {
    labelQuantidade() {
      return this.form.colheita ? "Quantidade Colhida" : "Quantidade Estimada";
    },

    formattedDateInitial() {
      return moment(this.form.mesInicio).format("DD/MM/YYYY");
    },
    formattedDateFinal() {
      return moment(this.form.mesFinal).format("DD/MM/YYYY");
    },
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
    async option(data) {
      if (data === "sim") {
        this.selected.forEach((selected) => {
          this.formEditou.etapas.forEach((data) => {
            if (data.NumEtapa > selected.NumEtapa) {
              data.NumEtapa--;
            }
          });
        });
        try {
          this.formEditou.etapas.forEach(async (data) => {
            const variables = {};
            variables.descricao = data.DescrEtapa;
            variables.mesFinal = data.MesFim;
            variables.mesInicio = data.MesInicio;
            variables.ordem = data.NumEtapa;
            variables.id = data.id;
            await culturaDesenvolvidaService.UpdateCulturaEtapa(variables);
          });
          this.selected.forEach(async (selected) => {
            const insumoPrevisto = selected.insumoPrevisto;
            const insumoPrestado = selected.insumoReal;
            const servicoPrevisto = selected.servicoPrevisto;
            const servicoPrestado = selected.servicoPrestado;

            if (servicoPrestado.length > 0)
              servicoPrestado.forEach(async (item) => {
                await insumoServicoService.DeleteServicoPrestado(item);
              });
            if (servicoPrevisto.length > 0)
              servicoPrevisto.forEach(async (item) => {
                await insumoServicoService.DeleteServicoPrevisto(item);
              });
            if (insumoPrestado.length > 0)
              insumoPrestado.forEach(async (item) => {
                await insumoServicoService.DeleteInsumoReal(item);
              });
            if (insumoPrevisto.length > 0)
              insumoPrevisto.forEach(async (item) => {
                await insumoServicoService.DeleteInsumoPrevisto(item);
              });
            const variables = {};
            variables.id = selected.id;
            await culturaDesenvolvidaService.DeleteCulturaEtapa(variables);
          });
          this.showDeleteDialog = false;
          this.mensagem = "Etapas deletadas com sucesso!";
          this.createSnackBar = true;
        } catch (e) {
          this.mensagem = e.message;
          this.color = "red";
          this.createSnackBar = true;
        }
      } else {
        this.showDeleteDialog = false;
      }
    },
    editarEtapaCadastrada(pValue) {
      this.formEtapa = {
        mesInicio: moment(pValue[0].MesInicio.substr(0, 7)).format("YYYY-MM"),
        mesFinal: moment(pValue[0].MesFim.substr(0, 7)).format("YYYY-MM"),
        descricao: pValue[0].DescrEtapa,
        ordem: pValue[0].NumEtapa,
        id: pValue[0].id,
      };
      this.editou = true;
      this.cadastrarEditarEtapa = true;
    },
    closeEtapaCadastrada() {
      this.cadastrarEditarEtapa = false;
    },
    closeServicoInsumo() {
      this.cadastrarEditarInsumoServico = false;
      this.isServico = false;
      this.isPrevisto = false;
    },
    formatTable(value) {
      return moment(value.substr(0, 10)).format("DD/MM/YYYY");
    },
    formatMonthTable(value) {
      return moment(value.substr(0, 7)).format("MM/YYYY");
    },
    showSnackBar(data) {
      this.createSnackBar = data;
    },

    salvarEtapa() {
      this.adicionarNovaEtapa = false;
      this.$v.$reset();
    },
    adicionarNovaEtapaCultura() {
      this.editou = false;
      this.cadastrarEditarEtapa = true;
      this.culturaDesenvolvidaId = this.form.id;
      this.etapasLength = this.form.etapas.length;
    },
    editarEtapa() {
      this.adicionarNovaEtapa = true;
    },
    excluirEtapa() {
      this.message = `Deseja realmente excluir as etapas?`;
      this.showDeleteDialog = true;
    },
    preencheForm() {
      this.form = {
        mesInicio: moment(this.formEditou.DataInicio.substr(0, 10)).format(
          "YYYY-MM-DD"
        ),
        id: this.formEditou.id,
        unidade: this.formEditou.Cultura.Und,
        terreno: this.formEditou.AreaTerrenoHectares,
        quantidade: this.formEditou.QtdColhida,
        culturaDescricao: this.formEditou.Cultura,
        colheita: this.formEditou.DataColheita !== null ? true : false,
        etapas: this.formEditou.etapas,
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
      this.selected = [];
      this.$emit("showDialogClose", this.editouCustoProducao);
      this.clean();
    },
    editarInsumoServico(pValue, isServico, isPrevisto) {
      this.culturaEtapaId = this.selected[0].id;

      this.formServicoInsumo = {
        datePrevista: pValue.Data,
        id: pValue.id,
        servico: pValue.Servico?.id,
        insumo: pValue.Insumo?.id,
      };
      this.isServico = isServico;
      this.isPrevisto = isPrevisto;
      this.formServicoInsumo.quantidade = this.isServico
        ? pValue.DiasHomem
        : pValue.Qtd;
      this.editouServicoInsumo = true;
      this.cadastrarEditarInsumoServico = true;
    },
    async optionInsumoServico(pValue) {
      if (pValue === "nao") {
        this.showDeleteInsumoServicoDialog = false;
      } else {
        try {
          if (this.excludedServico) {
            if (this.excludedPrevisto) {
              await insumoServicoService.DeleteServicoPrevisto(
                this.excludedInsumoServico
              );
            } else {
              await insumoServicoService.DeleteServicoPrestado(
                this.excludedInsumoServico
              );
            }
          } else {
            if (this.excludedPrevisto) {
              await insumoServicoService.DeleteInsumoPrevisto(
                this.excludedInsumoServico
              );
            } else {
              await insumoServicoService.DeleteInsumoReal(
                this.excludedInsumoServico
              );
            }
          }
          this.mensagem = "Excluido com sucesso!";
          this.showDeleteInsumoServicoDialog = false;
        } catch (e) {
          this.mensagem = e.message;
          this.createSnackBar = true;
          this.color = "red";
        }
      }
    },
    excluirInsumoServico(pValue, isServico, isPrevisto) {
      this.showDeleteInsumoServicoDialog = true;
      this.excludedInsumoServico = pValue;
      this.excludedServico = isServico;
      this.excludedPrevisto = isPrevisto;
      isServico
        ? (this.messageInsumoServico = `Deseja realmente excluir o serviço?`)
        : (this.messageInsumoServico = `Deseja realmente excluir o insumo?`);
    },
    criarInsumoServico(pValue) {
      this.culturaEtapaId = this.selected[0].id;

      this.cadastrarEditarInsumoServico = true;
    },
    async save() {
      try {
        await culturaDesenvolvidaService.UpdateCulturaDesenvolvida(this.form);
        this.createSnackBar = true;
        this.mensagem = "Custo de Produção editado com sucesso!";
        this.editouCustoProducao = false;
        this.$emit("showDialogClose", this.editouCustoProducao);
        this.clean();
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      }
    },
    calculaTotal(valor, quantidade) {
      return valor * quantidade;
    },

    close() {
      this.showDialogProduto = false;
      this.showDialogEtapas = false;
    },
    novaCultura() {
      this.showDialogProduto = true;
    },
    novaEtapa() {
      this.showDialogEtapas = true;
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

    cleanEtapa() {
      this.formEtapa = {
        mesInicio: new Date().toISOString().substr(0, 7),
        mesFinal: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substr(0, 7),
        datePrevista: moment().format("YYYY-MM-DD"),
        descricao: "",
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
  },
};
</script>
