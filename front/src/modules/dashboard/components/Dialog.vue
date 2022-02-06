<template>
  <v-dialog v-model="showDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <h3 class="subheading">{{ message }}</h3>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text small @click="option('nao')">Não</v-btn>
        <v-btn text small @click="option('sim')">Sim</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
  },

  methods: {
    option(data) {
      this.$emit("option", data);
    },
  },
};
</script>
