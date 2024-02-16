import "@ntohq/buefy-next/dist/buefy.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import buefy from "@ntohq/buefy-next";

import App from "./App.vue";

import router from "./router/router.js";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

// Register your buefy plugin
app.use(buefy);

app.mount("#app");
