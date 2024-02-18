import "@ntohq/buefy-next/dist/buefy.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import buefy from "@ntohq/buefy-next";

import App from "./App.vue";

import router from "./router/router.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPenToSquare);

const app = createApp(App);

// Register your font awesome plugin
app.component("font-awesome-icon", FontAwesomeIcon);

// Register your buefy plugin
app.use(buefy, {
  defaultIconPack: "fas",
  // ...
});

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.mount("#app");
