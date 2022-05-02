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
                      @keyup="getRate(selectedBase, selectedConverted)"
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
                      @keyup="getOppositeRate(selectedBase, selectedConverted)"
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
      conversionLoaded: Boolean,

      //modal variables - init values
      baseValue: 1,
      convertedValue: -1,
      currencyRate: Number,
      selectedBase: "EUR",
      selectedConverted: "USD",

      // api response data arrays
      currency: [],
      conversion: [],
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
      await this.axios.get("/conversion").then((result) => {
        this.conversion = result.data;
        this.conversionLoaded = true;
        // perform initial conversion
        this.getRate(this.selectedBase, this.selectedConverted);
      });
    },
    // ------ helper methods -----------
    getRate(from, to) {
      // extract only part of object which holds the needed informations
      this.currencyRate = this.conversion
        .filter((item) => item.base == from)
        .map((rate) => rate.rates[to]);
      // perform the conversion
      this.convertedValue = (
        Math.round(this.baseValue * this.currencyRate * 100) / 100
      ).toFixed(2);
    },
    getOppositeRate(from, to) {
      // extract only part of object which holds the needed informations
      this.currencyRate = this.conversion
        .filter((item) => item.base == to)
        .map((rate) => rate.rates[from]);
      // perform the conversion
      this.baseValue = (
        Math.round(this.convertedValue * this.currencyRate * 100) / 100
      ).toFixed(2);
    },
    changeCurrency(event, location) {
      switch (location) {
        case "base":
          this.selectedBase = event.target.value;
          this.getRate(this.selectedBase, this.selectedConverted);
          break;
        case "converted":
          this.selectedConverted = event.target.value;
          this.getRate(this.selectedBase, this.selectedConverted);
      }
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
