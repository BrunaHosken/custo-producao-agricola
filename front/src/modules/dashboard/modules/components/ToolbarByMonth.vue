<template>
  <v-toolbar :color="color" elevation="24" outlined>
    <v-layout align-center>
      <v-flex xs1>
        <div class="text-xs-left">
          <v-btn icon text @click="decrement">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs8 offset-xs1>
        <v-toolbar-title class="text-center">
          <span>{{ currentPeriod }}</span>
        </v-toolbar-title>
      </v-flex>

      <v-flex xs2 text-center mt-3>
        <v-toolbar-title class="text-center">
          <v-select
            v-model="periodSelected"
            :items="periods"
            :menu-props="{ maxHeight: '400' }"
            label="Período"
            item-text="state"
            item-value="abbr"
            persistent-hint
            return-object
            single-line
            @change="period"
          ></v-select>
        </v-toolbar-title>
      </v-flex>

      <v-flex xs1>
        <div class="text-right">
          <v-btn icon text @click="increment">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-toolbar>
</template>

<script>
import moment from "moment";

export default {
  name: "ToolbarByMonth",
  props: {
    format: String,
    color: String,
    month: String,
    showSlot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: moment(),
      periodSelected: "Mensal",
      periods: ["Semanal", "Mensal", "Anual"],
      currentPeriod: "",
      currentDate: "",
    };
  },

  created() {
    this.period();
  },
  methods: {
    period() {
      if (this.periodSelected === "Anual") {
        this.currentPeriod = this.date.format("YYYY");
        this.emitPeriod();
      }
      if (this.periodSelected === "Mensal") {
        this.currentPeriod = this.date.format("MMMM YYYY");
        this.emitPeriod();
      }
      if (this.periodSelected === "Semanal") {
        let formato = "DD/MM/YYYY";
        let inicio = this.date.day(0).format(formato);
        let fim = this.date.day(6).format(formato);
        this.currentPeriod = `${inicio} - ${fim}`;
        this.emitPeriod();
      }
    },
    emitPeriod() {
      let formato = "DD-MM-YYYY";
      this.currentDate = this.date.format(formato);
      this.$emit("period", this.periodSelected);
      this.$emit("date", this.currentDate);
    },

    decrement() {
      if (this.periodSelected === "Anual") {
        this.currentPeriod = this.date.subtract(1, "Y").format("YYYY");
      }
      if (this.periodSelected === "Mensal") {
        this.currentPeriod = this.date.subtract(1, "M").format("MMMM YYYY");
      }
      if (this.periodSelected === "Semanal") {
        let formato = "DD/MM/YYYY";

        let inicio = this.date.day(0).subtract(7, "d").format(formato);
        let fim = this.date.day(6).format(formato);
        this.currentPeriod = `${inicio} - ${fim}`;
      }
      this.emitPeriod();
    },
    increment() {
      if (this.periodSelected === "Anual") {
        this.currentPeriod = this.date.add(1, "Y").format("YYYY");
      }
      if (this.periodSelected === "Mensal") {
        this.currentPeriod = this.date.add(1, "M").format("MMMM YYYY");
      }
      if (this.periodSelected === "Semanal") {
        let formato = "DD/MM/YYYY";
        let inicio = this.date.day(0).add(7, "d").format(formato);
        let fim = this.date.day(6).format(formato);
        this.currentPeriod = `${inicio} - ${fim}`;
      }
      this.emitPeriod();
    },
  },
};
</script>
