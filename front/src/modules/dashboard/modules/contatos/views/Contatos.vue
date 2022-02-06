<template>
  <v-card elevation="24" outlined>
    <v-card-title class="headline"> Contato </v-card-title>
    <v-card-text>
      <p>
        Está notando alguma anomalia no sistema? Conte mais sobre o problema!
      </p>
      <v-textarea
        v-model="form.description"
        outlined
        name="description"
        label="Descrição"
        class="mt-9"
        row-height="15"
      ></v-textarea>
    </v-card-text>

    <v-card-actions class="mb-5 mr-4">
      <v-spacer></v-spacer>
      <v-btn color="orange accent-4k" @click="showClearDialog = true">
        Limpar
      </v-btn>
      <v-btn color="primary" @click="save"> Salvar </v-btn>
    </v-card-actions>
    <Dialog
      message="Deseja realmente limpar os dados?"
      :showDialog="showClearDialog"
      @option="option"
    />
  </v-card>
</template>

<script>
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
    };
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
      this.clear();
    },
  },
};
</script>
