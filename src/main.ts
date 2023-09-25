import { Lazyload, Toast } from "vant";
import "vant/lib/index.css";
import VConsole from "vconsole";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import "./style.css";
const vConsole = new VConsole();

const app = createApp(App);
app.use(Toast);
app.use(router);
app.use(Lazyload);
app.use(pinia);
app.mount("#app");
