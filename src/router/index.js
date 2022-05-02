import { createRouter, createWebHashHistory } from "vue-router";

const CurrencyConverter = () => import("../components/CurrencyConverter.vue");
const ExchangeRates = () => import("../components/ExchangeRates.vue");
const routes = [
  {
    path: "/",
    component: CurrencyConverter,
  },
  {
    path: "/exchange-rates",
    component: ExchangeRates,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
