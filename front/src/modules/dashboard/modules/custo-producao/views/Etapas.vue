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
              <v-row class="mt-2">
                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="descriptionEtapaErrors"
                    :success="!$v.form.descricao.$invalid"
                    v-model.trim="$v.form.descricao.$model"
                    label="Descrição da Etapa"
                    prepend-inner-icon="mdi-book-variant"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="form.ordem"
                    label="Ordem da Etapa"
                    prepend-inner-icon="mdi-order-numeric-ascending"
                    disabled
                    suffix="º"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <v-dialog
                    ref="dateDialogInitialEtapa"
                    :return-value.sync="form.mesInicio"
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
                        :error-messages="initialDateErrors"
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

                <v-col cols="12" md="6">
                  <v-dialog
                    ref="dateDialogFinalEtapa"
                    :return-value.sync="form.mesFinal"
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
    </v-flex>
  </v-dialog>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import SnackBar from "./../../../components/SnackBar.vue";
import culturaDesenvolvidaService from "./../services/culturaDesenvolvida-service.js";
import moment from "moment";
export default {
  name: "Etapas",
  components: {
    SnackBar,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    etapa: {
      type: Object,
      default: () => {},
    },
    editou: {
      type: Boolean,
      default: false,
    },
    culturaDesenvolvidaId: {
      type: String,
      default: "",
    },
    etapasLength: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        mesInicio: new Date().toISOString().substr(0, 7),
        mesFinal: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substr(0, 7),
        descricao: "",
        ordem: 1,
        culturaDesenvolvidaId: "",
      },
      mensagem: "",
      createSnackBar: false,
      color: "success",
      showDateDialogFinalEtapa: false,
      dateDialogValueFinalEtapa: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      )
        .toISOString()
        .substr(0, 7),
      showDateDialogInitialEtapa: false,
      dateDialogValueInitialEtapa: new Date().toISOString().substr(0, 7),
      editouEtapa: false,
    };
  },
  validations() {
    return {
      form: {
        descricao: {
          required,
          minLength: minLength(2),
        },
      },
    };
  },
  watch: {
    culturaDesenvolvidaId(pValue) {
      if (pValue !== null && pValue !== undefined) {
        this.form.ordem = this.etapasLength + 1;
        this.form.culturaDesenvolvidaId = pValue;
      }
    },
    etapa(pValue) {
      if (pValue) {
        this.form = {
          mesInicio: moment(pValue.mesInicio.substr(0, 7)).format("YYYY-MM"),
          mesFinal: moment(pValue.mesFinal.substr(0, 7)).format("YYYY-MM"),
          descricao: pValue.descricao,
          ordem: pValue.ordem,
          id: pValue.id,
        };
        this.dateDialogValueFinalEtapa = moment(
          pValue.mesFinal.substr(0, 7)
        ).format("YYYY-MM");

        this.dateDialogValueInitialEtapa = moment(
          pValue.mesFinal.substr(0, 7)
        ).format("YYYY-MM");
      }
    },
  },
  computed: {
    title() {
      return this.editou ? "Editar Etapa da Cultura" : "Nova Etapa da Cultura";
    },
    initialDateErrors() {
      const errors = [];

      if (this.form.mesInicio > this.form.mesFinal) {
        errors.push("Data inicial é maior do que a final");
      }
      return errors;
    },
    formattedDateFinalEtapa() {
      return moment(this.form.mesFinal).format("MM/YYYY");
    },
    formattedDateInitialEtapa() {
      return moment(this.form.mesInicio).format("MM/YYYY");
    },
    descriptionEtapaErrors() {
      const errors = [];
      const nome = this.$v.form.descricao;
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
    cancelDateDialogInitialEtapa() {
      this.showDateDialogInitialEtapa = false;
      this.dateDialogValueInitialEtapa = this.form.mesInicio;
    },
    cancelDateDialogFinalEtapa() {
      this.showDateDialogFinalEtapa = false;
      this.dateDialogValueFinalEtapa = this.form.mesFinal;
    },
    showSnackBarError(data) {
      this.createSnackBar = data;
    },
    clear() {
      this.form = {
        mesInicio: new Date().toISOString().substr(0, 7),
        mesFinal: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substr(0, 7),
        descricao: "",
      };
      this.form.ordem = this.etapasLength + 1;
      this.form.culturaDesenvolvidaId = this.culturaDesenvolvidaId;
    },
    cancelar() {
      this.$v.$reset();
      this.clear();
      this.$emit("showDialogClose", this.editouEtapa);
    },
    async salvar() {
      try {
        this.editou
          ? await culturaDesenvolvidaService.UpdateCulturaEtapa(this.form)
          : await culturaDesenvolvidaService.CreateCulturaEtapa(this.form);
        this.mensagem = "Etapa editada com sucesso!";
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
