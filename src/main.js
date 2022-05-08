import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// use Component globally in the app
const ModalTemplate = defineAsyncComponent(() =>
  import("./components/ModalTemplate.vue")
);

const ModalAlert = defineAsyncComponent(() =>
  import("./components/ModalAlert.vue")
);

axios.defaults.baseURL = " http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.put["Accept"] = "application/json";

createApp(App)
  .use(router)
  .use(VueAxios, axios)
  .component("modal-template", ModalTemplate)
  .component("modal-alert", ModalAlert)
  .mount("#app");
