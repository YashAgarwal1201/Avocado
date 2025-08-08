import {createApp} from "vue";
import "./style.css";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import {createPinia} from "pinia";
import router from "./router";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});
app.use(ToastService);
app.use(router);

app.mount("#app");
