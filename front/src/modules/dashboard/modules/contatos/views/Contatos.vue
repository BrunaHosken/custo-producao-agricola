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
  </v-card>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import Dialog from "./../../../components/Dialog.vue";
export default {
  name: "Contatos",
  components: {
    Dialog,
  },
  data() {
    return {
      form: {
        description: "",
      },
      showClearDialog: false,
      salvar: false,
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
    save() {
      console.log(this.form.description);
      this.$v.$reset();
      this.clear();
    },
  },
};
</script>
