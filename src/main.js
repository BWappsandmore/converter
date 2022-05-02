import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

axios.defaults.baseURL = " http://localhost:3000";

createApp(App).use(router).use(VueAxios, axios).mount("#app");
