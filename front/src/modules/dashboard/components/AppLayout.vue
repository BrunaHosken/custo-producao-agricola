<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />
    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import AppMenu from "./AppMenu.vue";
import AppToolbar from "./AppToolbar.vue";

export default {
  name: "AppLayout",
  components: {
    AppToolbar,
    AppMenu,
  },
  data: () => ({
    drawer: false,
  }),
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 300px !important;
}
</style>
