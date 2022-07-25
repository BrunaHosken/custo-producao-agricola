<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-flex xs12>
      <v-card class="elevation-24" outlined>
        <v-toolbar color="primary" dark>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                Editar Venda
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-btn icon dark @click="cancelar">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form>
            <v-container fill-height>
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
                    v-model="form.culturaDescricao"
                    hint="As culturas que irão aparecer são aquelas que já foram colhidas"
                    persistent-hint
                    :items="cultura"
                    :loading="loadingCultura"
                    item-text="label"
                    item-value="id"
                    :search-input.sync="searchCultura"
                    outlined
                    label="Cultura"
                    return-object
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                  />
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
                    item-text="label"
                    item-value="id"
                    return-object
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
      <ClientesEditNew
        :showDialog="showDialogCliente"
        @showDialogClose="close"
      />
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
  </v-dialog>
</template>

<script>
import moment from "moment";
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import ClientesEditNew from "./../../clientes/views/ClientesEditNew.vue";
import Dialog from "./../../../components/Dialog.vue";
import clienteService from "./../../clientes/services/cliente-service";
import culturaDesenvolvidaService from "./../../custo-producao/services/culturaDesenvolvida-service";
import vendasService from "./../services/vendasService";
import SnackBar from "./../../../components/SnackBar.vue";
export default {
  name: "VendasNew",
  components: {
    Dialog,
    ClientesEditNew,
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
  },
  data() {
    return {
      valid: false,
      items: ["Fixo", "Variavel"],
      cultura: [],
      clientes: [],
      loadingCultura: false,
      loadingCliente: false,
      searchCultura: null,
      searchCliente: null,
      unidades: ["Maço", "Dúzia"],
      form: {
        date: moment().format("YYYY-MM-DD"),
        culturaDescricao: "",
        valor: 0,
        cliente: "",
        unidade: "Maço",
        quantidade: 0,
        vendaId: "",
        vendaItemId: "",
      },
      vendasQuery: [],
      totalVendas: 0,
      showDateDialog: false,
      dateDialogValue: moment().format("YYYY-MM-DD"),
      showClearDialog: false,
      showDialogCliente: false,
      showDialogProduto: false,
      createSnackBar: false,
      mensagem: "",
      color: "success",
      editouCultura: false,
    };
  },
  validations() {
    return {
      form: {
        quantidade: {
          required,
          maxValue: maxValue(this.totalVendas),
          minValue: minValue(0.0000001),
        },
        valor: {
          required,
          minValue: minValue(0.0000001),
        },
      },
    };
  },
  watch: {
    "form.culturaDescricao"(pValue) {
      const vendas = this.vendasQuery.filter(
        (v) => v.CulturaDesenvolvida.Cultura.id === pValue.culturaId
      );
      const totalVendas = vendas.reduce((a, b) => {
        return a + b.Qtd;
      }, 0);
      this.totalVendas = pValue.quantidade - totalVendas;
    },
    formEditou(pValue) {
      if (pValue && pValue.length > 0) {
        console.log(pValue);
        this.form = {
          date: moment(pValue[0].Venda.Data.substr(0, 10)).format("YYYY-MM-DD"),
          valor: pValue[0].PrecoUnit,
          unidade: pValue[0].Und,
          quantidade: pValue[0].Qtd,
          vendaId: pValue[0].Venda.id,
          vendaItemId: pValue[0].id,
        };
        this.form.culturaDescricao = {
          label: pValue[0].CulturaDesenvolvida.Cultura.DescrCultura,
          culturaId: pValue[0].CulturaDesenvolvida.Cultura.id,
          quantidade: pValue[0].CulturaDesenvolvida.QtdColhida,
          id: pValue[0].CulturaDesenvolvida.id,
        };
        this.form.cliente = {
          label: pValue[0].Venda.Cliente.NomeCliente,
          id: pValue[0].Venda.Cliente.id,
        };
        this.dateDialogValue = moment(
          pValue[0].Venda.Data.substr(0, 10)
        ).format("YYYY-MM-DD");
      }
    },
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
      !quantity.required && errors.push("Valor é obrigatório!");
      if (!quantity.minValue || !quantity.maxValue) {
        errors.push(
          `Insira um valor acima de 0 e abaixo de ${this.totalVendas}`
        );
      }
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
      this.clientes.push({
        label: item.NomeCliente,
        id: item.id,
      });
    });
    this.form.cliente = this.clientes[0];
    const data = await culturaDesenvolvidaService.culturaDesenvolvida();
    const culturaDesenvolvida = data.filter((c) => c.DataColheita !== null);

    culturaDesenvolvida.forEach((item) => {
      this.cultura.push({
        label: item.Cultura.DescrCultura,
        culturaId: item.Cultura.id,
        quantidade: item.QtdColhida,
        id: item.id,
      });
    });
    this.vendasQuery = await vendasService.vendas();
    this.form.culturaDescricao = this.cultura[0];
  },
  methods: {
    showSnackBar(data) {
      this.createSnackBar = data;
    },
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
        culturaDescricao: "Crisântemo",
        valor: 0,
        cliente: this.clientes[0],
        unidade: "Maço",
        quantidade: 0,
      };
    },
    cancelar() {
      this.editouCultura = false;
      this.$emit("showDialogClose", this.editouCultura);
    },
    async salvar() {
      try {
        await vendasService.updateVendaItem(this.form);
        this.createSnackBar = true;
        this.mensagem = "Venda criada com sucesso!";
        this.editouCultura = false;
        //  this.$emit("showDialogClose", this.editouCultura);
      } catch (e) {
        this.mensagem = e.message;
        this.createSnackBar = true;
        this.color = "red";
      }
    },
  },
};
</script>
