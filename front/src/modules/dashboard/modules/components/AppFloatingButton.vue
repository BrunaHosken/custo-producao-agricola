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
          :title="fab ? 'Cancelar' : itensLength"
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
        :disabled="itensLength === 0"
        @click="selectedItensDelete"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>

      <v-btn
        fab
        small
        color="warning"
        title="Editar"
        :disabled="itensLength !== 1"
        @click="selectedItensEdit"
      >
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
    itensLength: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fab: false,
      showDeleteDialog: false,
      deletou: false,
      editou: false,
    };
  },

  methods: {
    option(data) {
      if (data == "nao") {
        this.deletou = false;
        this.showDeleteDialog = false;
      } else {
        console.log("deletou");
        this.deletou = true;
        this.showDeleteDialog = false;
        this.$emit("deletou", this.deletou);
      }
    },
    newRegister() {
      const novo = true;
      this.$emit("register", novo);
      switch (this.$route.path) {
        case "/dashboard/despesas":
          this.$router.push("/dashboard/despesas/new");
          break;
        case "/dashboard/servicos":
          this.$router.push("/dashboard/servicos/new");
          break;
        case "/dashboard/insumos":
          this.$router.push("/dashboard/insumos/new");
          break;

        default:
          break;
      }
    },
    selectedItensDelete() {
      this.showDeleteDialog = true;
    },
    selectedItensEdit() {
      this.editou = true;
      this.$emit("edicao", this.editou);
    },
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
