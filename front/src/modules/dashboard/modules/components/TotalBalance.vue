<template>
  <v-card>
    <v-card-title primary-title>
      <div class="text-center ma-auto">
        <p class="subheading">Saldo Atual</p>
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
  },
  data: () => ({
    total: 0,
  }),
  computed: {
    totalInCurrency() {
      return this.formatCurrency(this.total);
    },
  },
  created() {
    this.total = this.value;
  },
};
</script>
