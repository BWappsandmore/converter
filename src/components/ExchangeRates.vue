<template>
  <!-- main layout -->
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-4"></div>
      <div class="col-sm-4">
        <div class="table-responsive">
          <table class="table table-borderless align-middle">
            <tbody>
              <tr>
                <td>
                  <p class="pt-3">Währung aus der Liste wählen:</p>
                </td>
                <td>
                  <select
                    class="form-select"
                    v-if="currencyLoaded"
                    v-model="selected"
                    @change="changeCurrency($event)"
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
        <div class="table-responsive">
          <table
            class="table table-bordered border border-light border-1 align-middle"
          >
            <thead class="table-light">
              <tr>
                <td></td>
                <td v-for="k of keys" :key="k.id">{{ k }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1&nbsp;{{ this.selected }}</td>
                <td v-for="val of values" :key="val.id">{{ val }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          type="button"
          class="btn btn-primary mt-1"
          @click="redirectTo('/')"
        >
          Wechselrechner
        </button>
      </div>
      <div class="col-sm-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // boolean variables
      currencyLoaded: Boolean,
      conversionLoaded: Boolean,

      // api response data arrays
      currency: [],
      conversion: [],

      //modal variables - init values
      selected: "EUR",
      ratesBaseSelected: [],
      keys: [],
      values: [],
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
        this.getRatesForBase(this.selected);
      });
    },
    // ------ helper methods -----------
    changeCurrency(event) {
      this.selected = event.target.value;
      this.getRatesForBase(this.selected);
    },
    getRatesForBase(selected) {
      this.ratesBaseSelected = this.conversion
        .filter((item) => item.base == selected)
        .map((item) => item.rates);
      this.ratesBaseSelected.forEach((item) => {
        this.keys = Object.keys(item);
        this.values = Object.values(item);
      });
    },
    redirectTo(toPath) {
      this.$router.push({ path: toPath });
    },
  },
};
</script>
