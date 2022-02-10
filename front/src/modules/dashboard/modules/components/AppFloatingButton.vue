<template>
  <div>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          fab
          :color="fab ? 'red accent-2' : 'primary'"
          :title="fab ? 'Cancelar' : 'Opções'"
        >
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-btn
        fab
        small
        color="red accent-2"
        title="Remover"
        :disabled="itens.length === 0"
        @click="selectedItensDelete"
      >
        <!-- @click="delete" -->
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>

      <v-btn
        fab
        small
        color="warning"
        title="Editar"
        :disabled="itens.length !== 1"
        @click="selectedItensEdit"
      >
        <!-- @click="edit" -->
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn fab small color="success" title="Cadastrar" @click="newRegister">
        <!-- @click="new" -->
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-speed-dial>
    <Dialog
      message="Deseja realmente excluir o registro?"
      :showDialog="showDeleteDialog"
      @option="option"
    />
  </div>
</template>

<script>
import Dialog from "./../../components/Dialog.vue";
export default {
  name: "AppFloatingButton",
  components: {
    Dialog,
  },
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    itens: [],
  },
  data() {
    return {
      fab: false,
      showDeleteDialog: false,
    };
  },

  methods: {
    option(data) {
      if (data == "nao") {
        this.showDeleteDialog = false;
      } else {
        console.log("deletou");
        this.showDeleteDialog = false;
      }
    },
    newRegister() {
      console.log("novo");
    },
    selectedItensDelete() {
      this.showDeleteDialog = true;
      console.log("Deletou", this.itens);

      // console.log(
      //   this.itens.reduce((a, b) => {
      //     return b.index;
      //   }, 0)
      // );
    },
    selectedItensEdit() {},
    // addRecord(type) {
    //   this.$router
    //     .push({
    //       name: "recordsAdd",
    //       query: {
    //         type,
    //       },
    //     })
    //     .catch(() => {});
    // },
  },
};
</script>
