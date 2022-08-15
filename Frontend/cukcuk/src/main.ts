import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import "vue-universal-modal/dist/index.css";
import "@/plugins/vee-validate";
import VueUniversalModal from "vue-universal-modal";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());

app.use(VueUniversalModal, {
  teleportTarget: "#modals",
});
app.use(router);

app.mount("#app");
