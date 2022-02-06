<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="top"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="primary" fab>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-btn fab small color="red accent-2" title="Remover" :disabled="disabled">
      <!-- @click="delete" -->
      <v-icon>mdi-minus</v-icon>
    </v-btn>

    <v-btn fab small color="warning" title="Editar" :disabled="disabled">
      <!-- @click="edit" -->
      <v-icon>mdi-pencil-outline</v-icon>
    </v-btn>

    <v-btn fab small color="primary" title="Cadastrar">
      <!-- @click="new" -->
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-speed-dial>
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
  data: () => ({
    fab: false,
  }),

  // methods: {
  //   addRecord(type) {
  //     this.$router
  //       .push({
  //         name: "recordsAdd",
  //         query: {
  //           type,
  //         },
  //       })
  //       .catch(() => {});
  //   },
  // },
};
</script>
