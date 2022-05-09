<template>
  <v-snackbar v-model="showSnackBar" bottom right :color="color" class="mb-4">
    {{ mensagem }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="showSnackBar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackBar",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "success",
    },
    mensagem: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showSnackBar: false,
    };
  },
  watch: {
    show(pValue) {
      this.showSnackBar = this.show;
    },
    showSnackBar(pValue) {
      if (!pValue) {
        this.$emit("show", pValue);
      }
    },
  },
};
</script>
