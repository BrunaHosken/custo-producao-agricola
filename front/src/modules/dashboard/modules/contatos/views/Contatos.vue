<template>
  <v-card elevation="24" outlined>
    <v-card-title class="headline"> Contato </v-card-title>
    <v-card-text>
      <p>
        Está notando alguma anomalia no sistema? Conte mais sobre o problema!
      </p>
      <v-textarea
        :error-messages="descriptionErrors"
        :success="!$v.form.description.$invalid"
        v-model.trim="$v.form.description.$model"
        outlined
        name="description"
        label="Descrição"
        class="mt-9"
        type="text"
        row-height="15"
      ></v-textarea>
    </v-card-text>

    <v-card-actions class="mb-5 mr-4">
      <v-spacer></v-spacer>
      <v-btn color="orange accent-4k" @click="showClearDialog = true">
        Limpar
      </v-btn>
      <v-btn :disabled="$v.$invalid" color="primary" @click="save">
        Salvar
      </v-btn>
    </v-card-actions>

    <Dialog
      message="Deseja realmente limpar os dados?"
      :showDialog="showClearDialog"
      @option="option"
    />
    <SnackBar
      :show="createWithSuccess"
      mensagem="Contato enviado com sucesso!"
      @show="showSnackBarSuccess"
    />
    <SnackBar
      :show="createWithError"
      :mensagem="this.mensagem"
      color="red"
      @show="showSnackBarError"
    />
  </v-card>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import Dialog from "./../../../components/Dialog.vue";
import ContatoService from "./../services/contato-service";
import SnackBar from "./../../../components/SnackBar.vue";
import AuthService from "./../../../../auth/services/auth-service";
import emailjs from "emailjs-com";
export default {
  name: "Contatos",
  components: {
    Dialog,
    SnackBar,
  },
  data() {
    return {
      form: {
        description: "",
      },
      showClearDialog: false,
      salvar: false,
      createWithSuccess: false,
      mensagem: "",
      createWithError: false,
    };
  },
  validations() {
    return {
      form: {
        description: {
          required,
          minLength: minLength(2),
        },
      },
    };
  },
  computed: {
    descriptionErrors() {
      const errors = [];
      const description = this.$v.form.description;
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
  },
  methods: {
    showSnackBarSuccess(data) {
      this.createWithSuccess = data;
    },
    showSnackBarError(data) {
      this.createWithError = data;
    },
    option(data) {
      if (data == "nao") {
        this.showClearDialog = false;
      } else {
        this.clear();
        this.showClearDialog = false;
      }
    },
    clear() {
      this.form.description = "";
    },
    async save() {
      try {
        const response = await ContatoService.createContato(this.form);
        const user = await AuthService.agricultor();

        var templateParams = {
          user_name: user.Nome,
          message: response.createContato.DescrContato,
        };

        emailjs.send(
          "service_yhj9lbt",
          "template_zot1vrj",
          templateParams,
          "pdua2Pm4s61rHySot"
        );

        this.$v.$reset();
        this.clear();
        this.createWithSuccess = true;
      } catch (error) {
        this.createWithError = true;
        this.mensagem = error.message;
      }
    },
  },
};
</script>
