import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import pt from "vuetify/lib/locale/pt";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#2196F3",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
      dark: {
        primary: "#007BFF",
        secondary: "#424242",
        accent: "#46BDC6",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
    dark: true,
  },
  lang: {
    locales: { pt },
    current: "pt",
  },
});

export default vuetify;
