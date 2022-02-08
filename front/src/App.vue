<template>
  <v-app class="app" dark>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
.app {
  overflow-y: hidden;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #7c6f6f;

  border-radius: 5rem;
}

/* Handle on hover */
</style>
