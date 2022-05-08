<template>
  <!-- main layout -->
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-4"></div>
      <div class="col-sm-4">
        <p class="lead ps-5">
          {{ baseValue }}&nbsp;{{ selectedBase }}&nbsp;enspricht
        </p>
        <h1 class="display-1 ps-3">
          &nbsp;{{ convertedValue }}&nbsp;{{ selectedConverted }}
        </h1>
        <div class="table-responsive">
          <table class="table table-borderless align-middle">
            <tbody>
              <tr>
                <td>
                  <div class="input-group">
                    <input
                      id="baseValue"
                      type="number"
                      min="1"
                      class="form-control"
                      v-model="baseValue"
                      @keyup="
                        getRate(
                          this.getIdForCurrency(selectedBase),
                          this.getIdForCurrency(selectedConverted)
                        )
                      "
                    />
                  </div>
                </td>
                <td>
                  <select
                    class="form-select"
                    v-if="currencyLoaded"
                    v-model="selectedBase"
                    @change="changeCurrency($event, 'base')"
                  >
                    <option
                      v-for="item of currency"
                      :key="item.id"
                      :value="item.ISOcode"
                    >
                      {{ item.ISOcode }}&nbsp;-&nbsp;{{ item.currency }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="input-group">
                    <input
                      id="convertedValue"
                      type="number"
                      min="0"
                      class="form-control"
                      v-model="convertedValue"
                      @keyup="
                        this.getOppositeRate(
                          this.getIdForCurrency(selectedConverted),
                          this.getIdForCurrency(selectedBase)
                        )
                      "
                    />
                  </div>
                </td>
                <td>
                  <select
                    class="form-select"
                    v-if="currencyLoaded"
                    v-model="selectedConverted"
                    @change="changeCurrency($event, 'converted')"
                  >
                    <option
                      v-for="item of currency"
                      :key="item.id"
                      :value="item.ISOcode"
                    >
                      {{ item.ISOcode }}&nbsp;-&nbsp;{{ item.currency }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-grid d-md-flex justify-content-md-end">
          <button
            type="button"
            class="btn btn-success me-2"
            @click="redirectTo('/exchange-rates')"
          >
            Wechselkurs
          </button>
        </div>
      </div>
      <div class="col-sm-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CurrencyConverter",
  data() {
    return {
      // boolean variables
      currencyLoaded: Boolean,
      ratesLoaded: Boolean,

      //v-model variables - init values
      baseValue: 1,
      convertedValue: -1,
      currencyRate: Number,
      selectedBase: "EUR",
      selectedConverted: "USD",

      // api response data arrays
      currency: [],
      rates: [],
    };
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    // ------ api calls -----------
    async getCurrencies() {
      await this.axios.get("/currency").then((result) => {
        this.currency = result.data;
        this.currencyLoaded = true;
        //when done fire next api call and get conversion rates
        this.getRates();
      });
    },
    async getRates() {
      await this.axios.get("/rates/").then((result) => {
        this.rates = result.data;
        this.ratesLoaded = true;
        // perform initial rate
        this.getRate(
          this.getIdForCurrency(this.selectedBase),
          this.getIdForCurrency(this.selectedConverted)
        );
      });
    },

    //------ helper methods -----------
    getIdForCurrency(code) {
      return this.currency
        .filter((item) => item.ISOcode == code)
        .map((curr) => curr.id);
    },

    getRate(base, second) {
      this.currencyRate = this.rates
        .filter((item) => item.id_base == base && item.id_second == second)
        .map((output) => output.rate);
      this.convertedValue = (
        Math.round(this.baseValue * this.currencyRate * 100) / 100
      ).toFixed(2);
    },

    getOppositeRate(base, second) {
      this.currencyRate = this.rates
        .filter((item) => item.id_base == base && item.id_second == second)
        .map((output) => output.rate);
      this.baseValue = (
        Math.round(this.convertedValue * this.currencyRate * 100) / 100
      ).toFixed(2);
    },
    changeCurrency(event, location) {
      switch (location) {
        case "base":
          this.selectedBase = event.target.value;
          break;
        case "converted":
          this.selectedConverted = event.target.value;
      }
      this.getRate(
        this.getIdForCurrency(this.selectedBase),
        this.getIdForCurrency(this.selectedConverted)
      );
    },

    redirectTo(toPath) {
      this.$router.push({ path: toPath });
    },
  },
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
