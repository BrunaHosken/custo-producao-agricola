<template>
  <v-card elevation="24" outlined>
    <v-card-title primary-title>
      <div class="text-center ma-auto">
        <p class="subheading">{{ title }}</p>
        <h1 class="display-2">{{ totalInCurrency }}</h1>
      </div>
    </v-card-title>
  </v-card>
</template>
<script>
import formatCurrentMixin from "./../../../../mixins/format-currency";

export default {
  name: "TotalBalance",
  mixins: [formatCurrentMixin],
  props: {
    value: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    total: 0,
  }),
  computed: {
    totalInCurrency() {
      return this.formatCurrency(this.value);
    },
  },
};
</script>
