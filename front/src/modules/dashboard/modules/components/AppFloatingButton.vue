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
        :disabled="!disabled"
        @click="deleteDialog"
      >
        <!-- @click="delete" -->
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-btn fab small color="warning" title="Editar" :disabled="disabled">
        <!-- @click="edit" -->
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn fab small color="success" title="Cadastrar">
        <!-- @click="new" -->
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-dialog v-model="showDeleteDialog" max-width="300px">
      <v-card>
        <v-card-title>
          <h3 class="subheading">Deseja realmente sair?</h3>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small @click="showDeleteDialog = false">Não</v-btn>
          <v-btn text small @click="deleteItem">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "AppFloatingButton",
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fab: false,
      showDeleteDialog: false,
    };
  },

  methods: {
    deleteDialog() {
      this.showDeleteDialog = true;
    },
    deleteItem() {
      console.log("deletou");
      this.showDeleteDialog = false;
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
