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
              <v-row class="mt-4">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.tipoEtapa"
                    :items="itemsEtapa"
                    label="Tipo da Etapa"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.tipoUso"
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
                    :return-value.sync="form.datePrevista"
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
                      :allowedDates="allowedDates"
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
                          $refs.dateDialogPrevista.save(dateDialogValuePrevista)
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
                    :success="!$v.form.quantidade.$invalid"
                    v-model.trim="$v.form.quantidade.$model"
                    :label="label"
                    :value="form.quantidade"
                    prepend-inner-icon="mdi-numeric"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4" v-show="isServico">
                  <v-autocomplete
                    v-model="form.servico"
                    :items="itemsServico"
                    item-text="label"
                    item-value="id"
                    label="Serviço"
                    return-object
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
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" v-show="!isServico">
                  <v-autocomplete
                    v-model="form.insumo"
                    :items="itemsInsumo"
                    item-text="label"
                    item-value="id"
                    label="Insumo"
                    return-object
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    outlined
                  >
                    <v-list-item slot="prepend-item" ripple @click="novoInsumo">
                      <v-list-item-action>
                        <v-icon>mdi-plus</v-icon>
                      </v-list-item-action>
                      <v-list-item-title>Novo Insumo</v-list-item-title>
                    </v-list-item>
                    <v-divider slot="prepend-item" class="mt-2"></v-divider
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-4">
          <v-spacer></v-spacer>
          <v-btn color="secundary" class="mr-4 ma-2" @click="cancelar">
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            class="mr-4 ma-2"
            :disabled="$v.$invalid"
            @click="salvar"
          >
            Salvar Etapa
          </v-btn>
        </v-card-actions>
      </v-card>
      <SnackBar
        :show="createSnackBar"
        :mensagem="this.mensagem"
        :color="color"
        @show="showSnackBarError"
      />
      <InsumosEdit
        :showDialog="showDialogInsumo"
        :editou="false"
        @showDialogClose="close"
      />
      <ServicoEdit
        :showDialog="showDialogServico"
        :editou="false"
        @showDialogClose="close"
      />
    </v-flex>
  </v-dialog>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import SnackBar from "./../../../components/SnackBar.vue";
import insumoServicoService from "./../services/culturaDesenvolvida-service";
import InsumosEdit from "./../../insumos/views/InsumosEdit.vue";
import ServicoEdit from "./../../servicos/views/ServicosEdit.vue";
import servicoService from "./../../servicos/services/servicos-service.js";
import insumoService from "./../../insumos/services/insumo-services.js";
import moment from "moment";
export default {
  name: "InsumoServico",
  components: {
    SnackBar,
    InsumosEdit,
    ServicoEdit,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    servicoInsumo: {
      type: Object,
      default: () => {},
    },
    editou: {
      type: Boolean,
      default: false,
    },
    culturaEtapaId: {
      type: String,
      default: "",
    },
    servico: {
      type: Boolean,
      default: false,
    },
    previsto: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        datePrevista: moment().format("YYYY-MM-DD"),
        tipoEtapa: "Insumo",
        tipoUso: "Real",
        quantidade: 0,
        servico: "",
        insumo: "",
        culturaEtapaId: "",
        id: "",
      },
      mensagem: "",
      createSnackBar: false,
      color: "success",
      showDateDialogPrevista: false,
      dateDialogValuePrevista: moment().format("YYYY-MM-DD"),
      editouEtapa: false,
      itemsEtapa: ["Insumo", "Serviço"],
      itemsUso: ["Real", "Previsto"],
      itemsServico: [],
      itemsInsumo: [],
      isServico: false,
      isPrevisto: false,
      showDialogServico: false,
      showDialogInsumo: false,
      dataMinima: "",
    };
  },
  validations() {
    return {
      form: {
        quantidade: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  async created() {
    const dataServico = await servicoService.servico();
    dataServico.forEach((item) => {
      this.itemsServico.push({
        label: item.DescrServico,
        id: item.id,
      });
    });
    this.form.servico = this.itemsServico[0];
    const dataInsumo = await insumoService.insumos();
    dataInsumo.forEach((item) => {
      this.itemsInsumo.push({
        label: item.DescrInsumo,
        id: item.id,
      });
    });
    this.form.insumo = this.itemsInsumo[0];
  },
  watch: {
    culturaEtapaId(pValue) {
      if (pValue) {
        this.form.culturaEtapaId = pValue;
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
        this.form.datePrevista = undefined;
        this.dateDialogValuePrevista = undefined;
      } else {
        this.isPrevisto = false;
        this.form.datePrevista = moment().format("YYYY-MM-DD");
        this.dateDialogValuePrevista = moment().format("YYYY-MM-DD");
      }
    },

    servicoInsumo(pValue) {
      if (pValue) {
        this.form = {
          tipoEtapa: this.servico ? "Serviço" : "Insumo",
          tipoUso: this.previsto ? "Previsto" : "Real",
          quantidade: pValue.quantidade,
          servico: pValue.servico && pValue.servico.id,
          insumo: pValue.insumo && pValue.insumo.id,
          id: pValue.id,
        };
        this.dataMinima = pValue.dataMinima;
        this.form.datePrevista =
          pValue.datePrevista !== undefined
            ? moment(pValue.datePrevista.substr(0, 7)).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD");
        this.form.datePrevista !== undefined
          ? (this.dateDialogValuePrevista = this.form.datePrevista)
          : moment().format("YYYY-MM-DD");
        if (this.form.servico === undefined) {
          this.form.servico = this.itemsServico[0];
        }
        if (this.form.insumo === undefined) {
          this.form.insumo = this.itemsInsumo[0];
        }
      }
    },
  },
  computed: {
    label() {
      return this.isServico ? "Dias/Homem" : "Quantidade";
    },
    formattedDatePrevista() {
      return moment(this.form.datePrevista).format("DD/MM/YYYY");
    },

    title() {
      return this.editou ? "Editar Serviço/Insumo" : "Novo Serviço/Insumo";
    },

    valueEtapaErrors() {
      const errors = [];
      const quantidade = this.$v.form.quantidade;
      if (!quantidade.$dirty) {
        return errors;
      }
      !quantidade.required && errors.push("Quantidade  é obrigatória!");
      !quantidade.minValue && errors.push(`Insira um valor acima de 0`);
      return errors;
    },
  },
  methods: {
    allowedDates(val) {
      return val > this.dataMinima;
    },
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
    cancelDateDialogPrevista() {
      this.showDateDialogPrevista = false;
      this.dateDialogValuePrevista = this.form.datePrevista;
    },

    showSnackBarError(data) {
      this.createSnackBar = data;
    },
    clear() {
      this.form = {
        datePrevista: moment().format("YYYY-MM-DD"),
        tipoEtapa: "Insumo",
        tipoUso: "Real",
        quantidade: 0,
        servico: "",
        insumo: "",
      };
      this.form.servico = this.itemsServico[0];
      this.form.insumo = this.itemsInsumo[0];
      this.form.culturaEtapaId = this.culturaEtapaId;
    },
    cancelar() {
      this.$v.$reset();
      this.clear();
      this.$emit("showDialogClose", this.editouEtapa);
    },
    async salvar() {
      this.form.culturaEtapaId = this.culturaEtapaId;

      try {
        if (!this.editou) {
          if (this.isServico && this.isPrevisto)
            await insumoServicoService.CreateServicoPrevisto(this.form);
          if (this.isServico && !this.isPrevisto)
            await insumoServicoService.CreateServicoPrestado(this.form);
          if (!this.isServico && this.isPrevisto)
            await insumoServicoService.CreateInsumoPrevisto(this.form);
          if (!this.isServico && !this.isPrevisto)
            await insumoServicoService.CreateInsumoReal(this.form);
        } else {
          if (
            this.servico !== this.isServico ||
            this.previsto !== this.isPrevisto
          ) {
            if (this.previsto) {
              if (this.servico && this.previsto)
                await insumoServicoService.DeleteServicoPrevisto(this.form);
              else if (!this.servico && this.previsto)
                await insumoServicoService.DeleteInsumoPrevisto(this.form);
            } else {
              if (this.servico && !this.previsto)
                await insumoServicoService.DeleteServicoPrestado(this.form);
              else if (!this.servico && !this.previsto)
                await insumoServicoService.DeleteInsumoReal(this.form);
            }
            if (this.isServico && this.isPrevisto)
              await insumoServicoService.CreateServicoPrevisto(this.form);
            else if (this.isServico && !this.isPrevisto)
              await insumoServicoService.CreateServicoPrestado(this.form);
            else if (!this.isServico && this.isPrevisto)
              await insumoServicoService.CreateInsumoPrevisto(this.form);
            else if (!this.isServico && !this.isPrevisto) {
              await insumoServicoService.CreateInsumoReal(this.form);
            }
          } else {
            if (this.isServico && this.isPrevisto)
              await insumoServicoService.UpdateServicoPrevisto(this.form);
            else if (this.isServico && !this.isPrevisto)
              await insumoServicoService.UpdateServicoPrestado(this.form);
            else if (!this.isServico && this.isPrevisto)
              await insumoServicoService.UpdateInsumoPrevisto(this.form);
            else if (!this.isServico && !this.isPrevisto)
              await insumoServicoService.UpdateInsumoReal(this.form);
          }
        }
        this.mensagem = "Serviço/Insumo salvo com sucesso!";
        this.createSnackBar = true;
        this.editouEtapa = false;
        this.$v.$reset();
        this.clear();
        this.$emit("showDialogClose", this.editouEtapa);
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      }
    },
  },
};
</script>
